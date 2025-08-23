import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@v1/supabase/server'
import { z } from 'zod'

const uploadSchema = z.object({
  callId: z.string().uuid(),
  recordingUrl: z.string().url(),
  duration: z.number().positive(),
  fileSize: z.number().positive(),
  format: z.string().default('mp3'),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = uploadSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: validation.error.flatten() 
      }, { status: 400 })
    }

    const { callId, recordingUrl, duration, fileSize, format } = validation.data

    // Store recording metadata in database
    const { data: recording, error: dbError } = await supabase
      .from('call_recordings')
      .insert({
        call_id: callId,
        user_id: user.id,
        recording_url: recordingUrl,
        duration,
        file_size: fileSize,
        format,
        status: 'uploaded',
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to save recording metadata' }, { status: 500 })
    }

    // Trigger automatic transcription
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/recording/transcribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordingId: recording.id,
          audioUrl: recordingUrl,
          language: 'en',
        }),
      })
    } catch (transcriptionError) {
      console.warn('Failed to trigger transcription:', transcriptionError)
      // Don't fail the upload if transcription fails
    }

    return NextResponse.json({ 
      success: true, 
      recordingId: recording.id,
      message: 'Recording uploaded successfully' 
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload recording' 
    }, { status: 500 })
  }
}
