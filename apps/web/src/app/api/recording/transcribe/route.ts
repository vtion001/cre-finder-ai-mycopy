import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@v1/supabase/server'
import { z } from 'zod'

const transcribeSchema = z.object({
  recordingId: z.string().uuid(),
  audioUrl: z.string().url(),
  language: z.string().optional().default('en'),
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
    const validation = transcribeSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: validation.error.flatten() 
      }, { status: 400 })
    }

    const { recordingId, audioUrl, language } = validation.data

    // Call OpenAI Whisper API for transcription
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
      body: JSON.stringify({
        file: audioUrl,
        model: 'whisper-1',
        language: language,
        response_format: 'json',
      }),
    })

    if (!transcriptionResponse.ok) {
      throw new Error(`OpenAI API error: ${transcriptionResponse.statusText}`)
    }

    const transcriptionData = await transcriptionResponse.json()
    const transcript = transcriptionData.text

    // Store transcription in database
    const { error: dbError } = await supabase
      .from('call_recordings')
      .update({ 
        transcript,
        transcription_status: 'completed',
        transcribed_at: new Date().toISOString(),
      })
      .eq('id', recordingId)
      .eq('user_id', user.id)

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to save transcription' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      transcript,
      recordingId 
    })

  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json({ 
      error: 'Failed to transcribe recording' 
    }, { status: 500 })
  }
}
