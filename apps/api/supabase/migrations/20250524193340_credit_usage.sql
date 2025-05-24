CREATE OR REPLACE FUNCTION public.calculate_user_credit_usage()
RETURNS TABLE (
    consumed_credits INTEGER,
    max_allowed_credits INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_period_start TIMESTAMP WITH TIME ZONE;
    current_period_end TIMESTAMP WITH TIME ZONE;
    max_credits INTEGER;
    subscription_active BOOLEAN := FALSE;
BEGIN
    
    -- Get the user's active subscription details and credit limit
    SELECT 
        s.current_period_start,
        s.current_period_end,
        COALESCE((prod.metadata->>'max_searches')::INTEGER, 0)
    INTO 
        current_period_start, 
        current_period_end, 
        max_credits
    FROM 
        subscriptions s
        JOIN prices p ON s.price_id = p.id
        JOIN products prod ON p.product_id = prod.id
    WHERE 
        s.user_id = auth.uid()
        AND s.status IN ('active', 'trialing')
    ORDER BY s.created DESC
    LIMIT 1;
    
    -- Check if we found an active subscription
    IF current_period_start IS NOT NULL THEN
        subscription_active := TRUE;
    END IF;
    
    -- If no active subscription is found, check for alternative approaches
    IF NOT subscription_active THEN
        -- Option 1: Return zeros for no subscription
        consumed_credits := 0;
        max_allowed_credits := 0;
        RETURN NEXT;
        RETURN;
        
        -- Option 2: Uncomment below to provide a free tier
        /*
        max_credits := 10; -- Free tier limit
        current_period_start := date_trunc('month', now());
        current_period_end := (date_trunc('month', now()) + interval '1 month' - interval '1 day');
        */
    END IF;
    
    -- Count completed search results in the current billing period
    SELECT 
        COALESCE(SUM(result_count)::INTEGER, 0) INTO consumed_credits
    FROM 
        search_logs
    WHERE 
        search_logs.user_id = auth.uid()
        AND status = 'completed'
        AND created_at >= current_period_start
        AND created_at < current_period_end;

    -- Return the results
    max_allowed_credits := max_credits;
    RETURN NEXT;
    RETURN;
END;
$$;
-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.calculate_user_credit_usage() TO authenticated;

-- Enable RPC access to the function
COMMENT ON FUNCTION public.calculate_user_credit_usage IS 'Calculates a user''s credit usage for the current billing period';
