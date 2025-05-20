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
    subscription_start TIMESTAMP WITH TIME ZONE;
    max_credits INTEGER;
BEGIN
    
    -- Get the user's subscription start date and max allowed credits
    SELECT 
        u.subscription_start_date, 
        sp.max_searches INTO subscription_start, max_credits
    FROM 
        users u
        JOIN subscription_plans sp ON u.subscription_plan_id = sp.id
    WHERE 
        u.id = auth.uid();
    
    -- If no subscription is found, return zeros
    IF subscription_start IS NULL THEN
        consumed_credits := 0;
        max_allowed_credits := 0;
        RETURN NEXT;
        RETURN;
    END IF;
    
    -- Calculate the current billing period start date
    -- This assumes monthly billing cycles from the subscription start date
    DECLARE
        current_period_start TIMESTAMP WITH TIME ZONE;
    BEGIN
        -- Calculate the start of the current billing period
        -- This gets the most recent billing date on or before the current date
        current_period_start := date_trunc('day', subscription_start) + 
                               (EXTRACT(MONTH FROM age(now(), subscription_start))::INTEGER % 12) * 
                               INTERVAL '1 month';
        
        -- If we've gone past the day of month of the original subscription, add another month
        IF EXTRACT(DAY FROM current_period_start) < EXTRACT(DAY FROM subscription_start) THEN
            current_period_start := current_period_start + 
                                   ((EXTRACT(DAY FROM subscription_start) - EXTRACT(DAY FROM current_period_start)) * 
                                   INTERVAL '1 day');
        END IF;
        
        -- If the calculated date is in the future, go back one billing cycle
        IF current_period_start > now() THEN
            current_period_start := current_period_start - INTERVAL '1 month';
        END IF;
        
        -- Count completed searches results in the current billing period
        SELECT 
            COALESCE(SUM(result_count)::INTEGER, 0) INTO consumed_credits
        FROM 
            search_logs
        WHERE 
            search_logs.user_id = auth.uid()
            AND status = 'completed'
            AND created_at >= current_period_start
            AND created_at <= now();

        -- Return the results
        max_allowed_credits := max_credits;
        RETURN NEXT;
        RETURN;
    END;
END;
$$;
-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.calculate_user_credit_usage(UUID) TO authenticated;

-- Enable RPC access to the function
COMMENT ON FUNCTION public.calculate_user_credit_usage IS 'Calculates a user''s credit usage for the current billing period';
