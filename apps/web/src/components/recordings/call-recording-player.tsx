"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@v1/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@v1/ui/card'
import { Badge } from '@v1/ui/badge'
import { 
  IconPlayerPlay, 
  IconPlayerPause, 
  IconVolume, 
  IconVolumeOff,
  IconDownload,
  IconCopy
} from '@tabler/icons-react'
import { toast } from 'sonner'

interface CallRecording {
  id: string
  call_id: string
  recording_url: string
  duration: number
  file_size: number
  format: string
  transcript?: string
  transcription_status: 'pending' | 'completed' | 'failed'
  uploaded_at: string
}

interface CallRecordingPlayerProps {
  recording: CallRecording
  onTranscriptionComplete?: (transcript: string) => void
}

export function CallRecordingPlayer({ recording, onTranscriptionComplete }: CallRecordingPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return

    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const clickTime = (clickX / width) * recording.duration

    audioRef.current.currentTime = clickTime
    setCurrentTime(clickTime)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    setIsMuted(!isMuted)
    audioRef.current.muted = !isMuted
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const downloadRecording = () => {
    const link = document.createElement('a')
    link.href = recording.recording_url
    link.download = `call-recording-${recording.call_id}.${recording.format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyTranscript = async () => {
    if (!recording.transcript) return
    
    try {
      await navigator.clipboard.writeText(recording.transcript)
      toast.success('Transcript copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy transcript')
    }
  }

  const retryTranscription = async () => {
    setIsTranscribing(true)
    try {
      const response = await fetch('/api/recording/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordingId: recording.id,
          audioUrl: recording.recording_url,
          language: 'en',
        }),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Transcription completed')
        onTranscriptionComplete?.(result.transcript)
      } else {
        throw new Error('Transcription failed')
      }
    } catch (error) {
      toast.error('Failed to retry transcription')
    } finally {
      setIsTranscribing(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Call Recording
          <div className="flex gap-2">
            <Badge variant={recording.transcription_status === 'completed' ? 'default' : 'secondary'}>
              {recording.transcription_status}
            </Badge>
            <Button variant="outline" size="sm" onClick={downloadRecording}>
              <IconDownload className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Audio Player */}
        <div className="space-y-2">
          <audio ref={audioRef} src={recording.recording_url} preload="metadata" />
          
          {/* Progress Bar */}
          <div 
            ref={progressRef}
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${(currentTime / recording.duration) * 100}%` }}
            />
          </div>
          
          {/* Time Display */}
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(recording.duration)}</span>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button onClick={togglePlay} variant="outline" size="sm">
              {isPlaying ? <IconPlayerPause className="h-4 w-4" /> : <IconPlayerPlay className="h-4 w-4" />}
            </Button>
            
            <div className="flex items-center gap-2">
              <Button onClick={toggleMute} variant="ghost" size="sm">
                {isMuted ? <IconVolumeOff className="h-4 w-4" /> : <IconVolume className="h-4 w-4" />}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20"
              />
            </div>
          </div>
        </div>

        {/* File Info */}
        <div className="text-sm text-gray-600 space-y-1">
          <p>Format: {recording.format.toUpperCase()}</p>
          <p>Size: {(recording.file_size / 1024 / 1024).toFixed(2)} MB</p>
          <p>Uploaded: {new Date(recording.uploaded_at).toLocaleDateString()}</p>
        </div>

        {/* Transcript */}
        {recording.transcript && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Transcript</h4>
              <Button onClick={copyTranscript} variant="ghost" size="sm">
                <IconCopy className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-3 bg-gray-50 rounded-md text-sm">
              {recording.transcript}
            </div>
          </div>
        )}

        {/* Transcription Status */}
        {recording.transcription_status === 'failed' && (
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-md">
            <span className="text-sm text-red-600">Transcription failed</span>
            <Button 
              onClick={retryTranscription} 
              variant="outline" 
              size="sm"
              disabled={isTranscribing}
            >
              {isTranscribing ? 'Retrying...' : 'Retry'}
            </Button>
          </div>
        )}

        {recording.transcription_status === 'pending' && (
          <div className="p-3 bg-yellow-50 rounded-md">
            <span className="text-sm text-yellow-600">Transcription in progress...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
