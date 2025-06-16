-- Add skip trace fields to property_records table
ALTER TABLE public.property_records 
ADD COLUMN skip_trace_data JSONB,
ADD COLUMN skip_trace_updated_at TIMESTAMP WITH TIME ZONE;

-- Create index for skip trace data queries
CREATE INDEX property_records_skip_trace_data_idx ON public.property_records (skip_trace_data);
CREATE INDEX property_records_skip_trace_updated_at_idx ON public.property_records (skip_trace_updated_at);

-- Add index for filtering records without skip trace data
CREATE INDEX property_records_no_skip_trace_idx ON public.property_records (location_license_id) 
WHERE skip_trace_data IS NULL;
