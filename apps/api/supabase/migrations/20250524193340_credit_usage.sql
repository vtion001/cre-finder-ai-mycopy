-- Create credit movements table to track all credit transactions
CREATE TYPE public.credit_movement_type AS ENUM ('subscription', 'purchase', 'bonus', 'refund', 'adjustment');

CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (
        transaction_type IN (
            'subscription',
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

CREATE OR REPLACE FUNCTION public.calculate_user_credit_usage()
RETURNS TABLE (
    consumed_credits INTEGER,
    available_credits INTEGER,
    expiring_credits INTEGER,
    remaining_credits INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_period_start TIMESTAMP WITH TIME ZONE;
    current_period_end TIMESTAMP WITH TIME ZONE;
    total_available INTEGER := 0;
    total_expiring INTEGER := 0;
    total_consumed INTEGER := 0;
BEGIN
    -- Set current period (monthly)
    current_period_start := date_trunc('month', now());
    current_period_end := (date_trunc('month', now()) + interval '1 month');
    
    -- Calculate available credits from all positive transactions (non-expired)
    SELECT 
        COALESCE(SUM(credit_amount), 0) INTO total_available
    FROM 
        credit_transactions
    WHERE 
        user_id = auth.uid()
        AND (expires_at IS NULL OR expires_at > now())
        AND credit_amount > 0; -- Only count positive credit additions
    
    -- Calculate credits expiring in the next 7 days
    SELECT 
        COALESCE(SUM(credit_amount), 0) INTO total_expiring
    FROM 
        credit_transactions
    WHERE 
        user_id = auth.uid()
        AND expires_at IS NOT NULL
        AND expires_at > now()
        AND expires_at <= (now() + interval '7 days')
        AND credit_amount > 0;
    
    -- Calculate consumed credits from negative transactions in current period
    SELECT 
        COALESCE(ABS(SUM(credit_amount)), 0) INTO total_consumed
    FROM 
        credit_transactions
    WHERE 
        user_id = auth.uid()
        AND credit_amount < 0 -- Only count negative transactions (consumption)
        AND created_at >= current_period_start
        AND created_at < current_period_end;
    
    -- Set return values
    consumed_credits := total_consumed;
    available_credits := total_available;
    expiring_credits := total_expiring;
    remaining_credits := total_available - total_consumed;
    
    -- Return the results
    RETURN NEXT;
    RETURN;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_user_credit_usage()
RETURNS TABLE (
    total_consumed INTEGER,
    total_available INTEGER,
    total_extra INTEGER,
    total_expiring_soon INTEGER,
    remaining_credits INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_period_start TIMESTAMP WITH TIME ZONE;
    current_period_end TIMESTAMP WITH TIME ZONE;
    available_credits INTEGER := 0;
    extra_credits INTEGER := 0;
    expiring_soon_credits INTEGER := 0;
    consumed_credits INTEGER := 0;
BEGIN
    -- Set current period (monthly)
    current_period_start := date_trunc('month', now());
    current_period_end := (date_trunc('month', now()) + interval '1 month');
    
    -- Calculate available credits from all positive transactions (non-expired)
    SELECT 
        COALESCE(SUM(credit_amount), 0) INTO available_credits
    FROM 
        credit_transactions
    WHERE 
        user_id = auth.uid()
        AND (expires_at IS NULL OR expires_at > now())
        AND credit_amount > 0; -- Only count positive credit additions
    
    -- Calculate available extra credits (purchased credits, non-expired)
    SELECT 
        COALESCE(SUM(credit_amount), 0) INTO extra_credits
    FROM 
        credit_transactions
    WHERE 
        user_id = auth.uid()
        AND transaction_type = 'purchase'
        AND (expires_at IS NULL OR expires_at > now())
        AND credit_amount > 0;
    
    -- Calculate credits expiring in the next 7 days
    SELECT 
        COALESCE(SUM(credit_amount), 0) INTO expiring_soon_credits
    FROM 
        credit_transactions
    WHERE 
        user_id = auth.uid()
        AND expires_at IS NOT NULL
        AND expires_at > now()
        AND expires_at <= (now() + interval '7 days')
        AND credit_amount > 0;
    
    -- Calculate consumed credits from negative transactions in current period
    SELECT 
        COALESCE(ABS(SUM(credit_amount)), 0) INTO consumed_credits
    FROM 
        credit_transactions
    WHERE 
        user_id = auth.uid()
        AND credit_amount < 0 -- Only count negative transactions (consumption)
        AND created_at >= current_period_start
        AND created_at < current_period_end;
    
    -- Set return values
    total_consumed := consumed_credits;
    total_available := available_credits;
    total_extra := extra_credits;
    total_expiring_soon := expiring_soon_credits;
    remaining_credits := available_credits - consumed_credits;
    
    -- Return the results
    RETURN NEXT;
    RETURN;
END;
$$;
-- Grant execute permissions
GRANT
EXECUTE ON FUNCTION public.calculate_user_credit_usage () TO authenticated;

GRANT
EXECUTE ON FUNCTION public.consume_user_credits (INTEGER) TO authenticated;

-- Update function comments
COMMENT ON FUNCTION public.calculate_user_credit_usage IS 'Calculates a user''s credit usage based on credit transactions for the current billing period';

COMMENT ON FUNCTION public.consume_user_credits IS 'Consumes credits by creating a negative credit transaction';

-- Create function to handle credit consumption when search is completed
CREATE OR REPLACE FUNCTION public.consume_credits_on_search_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    credits_to_consume INTEGER;
    consumption_successful BOOLEAN;
BEGIN
    -- Only proceed if status changed to 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        

        credits_to_consume := NEW.result_count;
        
        SELECT consume_user_credits(credits_to_consume) INTO consumption_successful;
        
        -- If credit consumption failed, prevent the status update
        IF NOT consumption_successful THEN
            RAISE EXCEPTION 'Insufficient credits to complete search. Required: %, Available: %', 
                credits_to_consume,
                (SELECT remaining_credits FROM calculate_user_credit_usage());
        END IF;
        
        -- Log the credit consumption for audit purposes
        RAISE NOTICE 'Consumed % credits for search % by user %', 
            credits_to_consume, NEW.id, NEW.user_id;
            
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER search_completion_credit_consumption
    AFTER UPDATE ON public.search_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.consume_credits_on_search_completion();

-- Grant necessary permissions
GRANT
EXECUTE ON FUNCTION public.consume_credits_on_search_completion () TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.consume_credits_on_search_completion () IS 'Automatically consumes user credits when a search log status is changed to completed';