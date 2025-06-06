CREATE TYPE public.search_status AS ENUM ('preview', 'pending', 'completed', 'failed');

-- Create search_logs table
CREATE TABLE public.search_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    asset_type_id UUID NOT NULL REFERENCES public.asset_types (id) ON DELETE CASCADE,
    search_parameters JSONB NOT NULL,
    result_count INTEGER NOT NULL,
    execution_time_ms INTEGER,
    status public.search_status NOT NULL DEFAULT 'preview',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create triggers to update the updated_at column
CREATE TRIGGER search_logs_updated_at
BEFORE UPDATE ON public.search_logs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable row level security for all tables
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for search_logs
CREATE POLICY select_own_search_logs ON public.search_logs FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY insert_own_search_logs ON public.search_logs FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY update_own_search_logs ON public.search_logs
FOR UPDATE
    USING (auth.uid () = user_id);

CREATE POLICY delete_own_search_logs ON public.search_logs FOR DELETE USING (auth.uid () = user_id);

-- Create indexes for efficient querying
CREATE INDEX search_logs_user_id_idx ON public.search_logs (user_id);

CREATE INDEX search_logs_created_at_idx ON public.search_logs (created_at);