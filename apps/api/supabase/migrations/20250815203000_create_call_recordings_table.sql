-- Create call_recordings table for storing call recordings and transcriptions
CREATE TABLE IF NOT EXISTS public.call_recordings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    call_id UUID NOT NULL REFERENCES public.outbound_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recording_url TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    file_size BIGINT NOT NULL CHECK (file_size > 0),
    format VARCHAR(10) NOT NULL DEFAULT 'mp3',
    transcript TEXT,
    transcription_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (transcription_status IN ('pending', 'completed', 'failed')),
    transcribed_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'failed')),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_call_recordings_call_id ON public.call_recordings(call_id);
CREATE INDEX IF NOT EXISTS idx_call_recordings_user_id ON public.call_recordings(user_id);
CREATE INDEX IF NOT EXISTS idx_call_recordings_status ON public.call_recordings(status);
CREATE INDEX IF NOT EXISTS idx_call_recordings_transcription_status ON public.call_recordings(transcription_status);
CREATE INDEX IF NOT EXISTS idx_call_recordings_uploaded_at ON public.call_recordings(uploaded_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_call_recordings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_call_recordings_updated_at
    BEFORE UPDATE ON public.call_recordings
    FOR EACH ROW
    EXECUTE FUNCTION update_call_recordings_updated_at();

-- Enable Row Level Security
ALTER TABLE public.call_recordings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own call recordings" ON public.call_recordings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own call recordings" ON public.call_recordings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own call recordings" ON public.call_recordings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own call recordings" ON public.call_recordings
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.call_recordings TO authenticated;
