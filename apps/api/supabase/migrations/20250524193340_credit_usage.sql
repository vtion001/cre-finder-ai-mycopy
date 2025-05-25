-- Create credit movements table to track all credit transactions
CREATE TYPE public.credit_movement_type AS ENUM ('purchase', 'bonus', 'refund', 'adjustment');

CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (
        transaction_type IN (
            'purchase',
            'bonus',
            'refund',
            'adjustment'
        )
    ),
    credit_amount INTEGER NOT NULL, -- Positive for credits added, negative for adjustments
    description TEXT,
    reference_id TEXT, -- Could be payment ID, order ID, etc.
    expires_at TIMESTAMP WITH TIME ZONE, -- NULL for non-expiring credits
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions (user_id);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_expires_at ON public.credit_transactions (expires_at);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions (created_at);

-- Enable RLS
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for credit_transactions
CREATE POLICY "Users can view their own credit transactions" ON public.credit_transactions FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Service role can manage credit transactions" ON public.credit_transactions FOR ALL USING (auth.role () = 'service_role');

-- Create trigger for updated_at
CREATE TRIGGER credit_transactions_updated_at
BEFORE UPDATE ON public.credit_transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Updated function with extra credits support
CREATE OR REPLACE FUNCTION public.calculate_user_credit_usage()
RETURNS TABLE (
    consumed_credits INTEGER,
    subscription_credits INTEGER,
    extra_credits_available INTEGER,
    extra_credits_expiring_soon INTEGER,
    total_available_credits INTEGER,
    remaining_credits INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_period_start TIMESTAMP WITH TIME ZONE;
    current_period_end TIMESTAMP WITH TIME ZONE;
    subscription_max_credits INTEGER := 0;
    extra_credits INTEGER := 0;
    expiring_credits INTEGER := 0;
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
        subscription_max_credits
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
    
    -- If no active subscription, set up free tier or basic limits
    IF NOT subscription_active THEN
        subscription_max_credits := 0; -- Or set to free tier limit like 10
        current_period_start := date_trunc('month', now());
        current_period_end := (date_trunc('month', now()) + interval '1 month');
    END IF;
    
    -- Calculate available extra credits (non-expired)
    SELECT 
        COALESCE(SUM(credit_amount), 0) INTO extra_credits
    FROM 
        credit_transactions
    WHERE 
        user_id = auth.uid()
        AND (expires_at IS NULL OR expires_at > now())
        AND credit_amount > 0; -- Only count positive credit additions
    
    -- Calculate credits expiring in the next 7 days
    SELECT 
        COALESCE(SUM(credit_amount), 0) INTO expiring_credits
    FROM 
        credit_transactions
    WHERE 
        user_id = auth.uid()
        AND expires_at IS NOT NULL
        AND expires_at > now()
        AND expires_at <= (now() + interval '7 days')
        AND credit_amount > 0;
    
    -- Count consumed credits in the current billing period
    SELECT 
        COALESCE(SUM(result_count)::INTEGER, 0) INTO consumed_credits
    FROM 
        search_logs
    WHERE 
        search_logs.user_id = auth.uid()
        AND status = 'completed'
        AND created_at >= current_period_start
        AND created_at < current_period_end;

    -- Calculate totals
    subscription_credits := subscription_max_credits;
    extra_credits_available := extra_credits;
    extra_credits_expiring_soon := expiring_credits;
    total_available_credits := subscription_max_credits + extra_credits;
    remaining_credits := total_available_credits - consumed_credits;
    
    -- Return the results
    RETURN NEXT;
    RETURN;
END;
$$;

-- Function to consume credits (call this when a search is completed)
CREATE OR REPLACE FUNCTION public.consume_user_credits(
    credits_to_consume INTEGER DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    usage_data RECORD;
    remaining_to_consume INTEGER;
    credits_from_subscription INTEGER;
    credits_from_extras INTEGER;
BEGIN
    -- Get current usage data
    SELECT * INTO usage_data
    FROM calculate_user_credit_usage();
    
    -- Check if user has enough credits
    IF (usage_data.total_available_credits - usage_data.consumed_credits) < credits_to_consume THEN
        RETURN FALSE; -- Not enough credits
    END IF;
    
    remaining_to_consume := credits_to_consume;
    
    -- First, consume from subscription credits if available
    credits_from_subscription := LEAST(
        remaining_to_consume,
        GREATEST(0, usage_data.subscription_credits - usage_data.consumed_credits)
    );
    
    remaining_to_consume := remaining_to_consume - credits_from_subscription;
    
    -- If we still need to consume more, deduct from extra credits
    IF remaining_to_consume > 0 THEN
        -- Create a negative transaction to represent consumption of extra credits
        INSERT INTO credit_transactions (
            user_id,
            transaction_type,
            credit_amount,
            description
        ) VALUES (
            auth.uid(),
            'adjustment',
            -remaining_to_consume,
            'Credits consumed for search'
        );
    END IF;
    
    RETURN TRUE; -- Successfully consumed credits
END;
$$;

-- Grant execute permissions
GRANT
EXECUTE ON FUNCTION public.calculate_user_credit_usage () TO authenticated;

GRANT
EXECUTE ON FUNCTION public.consume_user_credits (INTEGER) TO authenticated;

-- Update function comments
COMMENT ON FUNCTION public.calculate_user_credit_usage IS 'Calculates a user''s credit usage including subscription and extra credits for the current billing period';

COMMENT ON FUNCTION public.consume_user_credits IS 'Consumes credits when a search is completed';