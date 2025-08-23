# 🔌 Ultimate API & Third-Party Integration Knowledge Base for Replit

## Table of Contents
1. [VAPI - Voice AI Integration](#vapi-integration)
2. [Twilio Complete Integration Suite](#twilio-integration)
3. [SendGrid Email Service](#sendgrid-integration)
4. [AWS Services Integration](#aws-integration)
5. [MCP (Model Context Protocol) Integration](#mcp-integration)
6. [Marketing Tools Integration](#marketing-tools)
7. [Payment Processing Systems](#payment-systems)
8. [Analytics & Monitoring](#analytics-monitoring)
9. [Real-time Communication](#realtime-communication)
10. [Cloud Storage Solutions](#cloud-storage)
11. [AI/ML Service Integration](#ai-ml-services)
12. [Webhook Management](#webhook-management)
13. [API Gateway & Rate Limiting](#api-gateway)
14. [Security & Authentication Services](#security-services)
15. [Complete Integration Patterns](#integration-patterns)

---

## 1. VAPI - Voice AI Integration {#vapi-integration}

### Installation & Setup
```bash
# Install VAPI dependencies
pnpm add @vapi-ai/web @vapi-ai/server-sdk
pnpm add -D @types/websocket
```

### VAPI Configuration
```typescript
// /lib/vapi/config.ts
import { Vapi } from '@vapi-ai/server-sdk';

export const vapiConfig = {
  apiKey: process.env.VAPI_API_KEY!,
  orgId: process.env.VAPI_ORG_ID!,
  webhookSecret: process.env.VAPI_WEBHOOK_SECRET!,
  assistantId: process.env.VAPI_ASSISTANT_ID!,
};

// Initialize VAPI client
export const vapi = new Vapi({
  apiKey: vapiConfig.apiKey,
});

// Voice assistant configuration
export const assistantConfig = {
  name: "AI Assistant",
  firstMessage: "Hello! How can I help you today?",
  model: {
    provider: "openai",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 150,
    systemPrompt: `You are a helpful AI assistant for a SaaS application.
    Be concise, friendly, and professional. Keep responses under 30 seconds when spoken.`,
  },
  voice: {
    provider: "11labs",
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Rachel voice
    stability: 0.5,
    similarityBoost: 0.75,
  },
  endCallFunctionEnabled: true,
  endCallMessage: "Thank you for calling. Have a great day!",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en-US",
  },
  silenceTimeoutSeconds: 30,
  responseDelaySeconds: 0.5,
  llmRequestDelaySeconds: 0.1,
  numWordsToInterruptAssistant: 2,
};
```

### VAPI Web Integration Component
```typescript
// /components/vapi/voice-assistant.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { Vapi } from '@vapi-ai/web';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

interface VoiceAssistantProps {
  assistantId: string;
  onCallStart?: () => void;
  onCallEnd?: (duration: number) => void;
  onTranscript?: (transcript: string) => void;
  onError?: (error: Error) => void;
}

export function VoiceAssistant({
  assistantId,
  onCallStart,
  onCallEnd,
  onTranscript,
  onError,
}: VoiceAssistantProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantMessage, setAssistantMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const vapiRef = useRef<Vapi | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize VAPI client
    vapiRef.current = new Vapi({
      apiKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!,
      debug: process.env.NODE_ENV === 'development',
    });

    const vapi = vapiRef.current;

    // Event listeners
    vapi.on('call-start', () => {
      setIsCallActive(true);
      onCallStart?.();
      
      // Start duration timer
      const startTime = Date.now();
      intervalRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    });

    vapi.on('call-end', () => {
      setIsCallActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      onCallEnd?.(callDuration);
    });

    vapi.on('speech-start', () => {
      console.log('User started speaking');
    });

    vapi.on('speech-end', () => {
      console.log('User stopped speaking');
    });

    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        if (message.role === 'user') {
          setTranscript(message.transcript);
          onTranscript?.(message.transcript);
        } else {
          setAssistantMessage(message.transcript);
        }
      }
    });

    vapi.on('error', (error) => {
      console.error('VAPI Error:', error);
      onError?.(new Error(error.message));
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      vapi.stop();
    };
  }, [assistantId, onCallStart, onCallEnd, onTranscript, onError, callDuration]);

  const startCall = async () => {
    try {
      await vapiRef.current?.start({
        assistantId,
        // Optional: Pass custom variables
        variables: {
          userName: 'User',
          context: 'Customer Support',
        },
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      onError?.(error as Error);
    }
  };

  const endCall = async () => {
    try {
      await vapiRef.current?.stop();
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      if (isMuted) {
        vapiRef.current.setMuted(false);
      } else {
        vapiRef.current.setMuted(true);
      }
      setIsMuted(!isMuted);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Voice Assistant</h3>
        {isCallActive && (
          <p className="text-sm text-gray-600">
            Call Duration: {formatDuration(callDuration)}
          </p>
        )}
      </div>

      <div className="flex space-x-2">
        {!isCallActive ? (
          <Button
            onClick={startCall}
            className="flex items-center space-x-2"
            variant="default"
          >
            <Phone className="w-4 h-4" />
            <span>Start Call</span>
          </Button>
        ) : (
          <>
            <Button
              onClick={toggleMute}
              variant={isMuted ? "destructive" : "secondary"}
              className="flex items-center space-x-2"
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </Button>
            <Button
              onClick={endCall}
              variant="destructive"
              className="flex items-center space-x-2"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </Button>
          </>
        )}
      </div>

      {isCallActive && (
        <div className="w-full max-w-md space-y-2">
          {transcript && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">You:</p>
              <p className="text-sm text-blue-700">{transcript}</p>
            </div>
          )}
          {assistantMessage && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Assistant:</p>
              <p className="text-sm text-gray-700">{assistantMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### VAPI Server-Side API Routes
```typescript
// /app/api/vapi/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { vapiConfig } from '@/lib/vapi/config';

// Verify VAPI webhook signature
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', vapiConfig.webhookSecret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-vapi-signature');
    const payload = await request.text();
    
    if (!signature || !verifyWebhookSignature(payload, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    const event = JSON.parse(payload);
    
    // Handle different VAPI events
    switch (event.type) {
      case 'call.started':
        await handleCallStarted(event);
        break;
        
      case 'call.ended':
        await handleCallEnded(event);
        break;
        
      case 'transcript.final':
        await handleTranscript(event);
        break;
        
      case 'function.called':
        return await handleFunctionCall(event);
        
      default:
        console.log('Unhandled VAPI event:', event.type);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('VAPI webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleCallStarted(event: any) {
  const { callId, assistantId, customerId, startedAt } = event.data;
  
  await prisma.voiceCall.create({
    data: {
      callId,
      assistantId,
      customerId,
      status: 'active',
      startedAt: new Date(startedAt),
    },
  });
}

async function handleCallEnded(event: any) {
  const { callId, endedAt, duration, endReason, cost } = event.data;
  
  await prisma.voiceCall.update({
    where: { callId },
    data: {
      status: 'completed',
      endedAt: new Date(endedAt),
      duration,
      endReason,
      cost,
    },
  });
}

async function handleTranscript(event: any) {
  const { callId, transcript, role, timestamp } = event.data;
  
  await prisma.callTranscript.create({
    data: {
      callId,
      role,
      content: transcript,
      timestamp: new Date(timestamp),
    },
  });
}

async function handleFunctionCall(event: any) {
  const { functionName, parameters, callId } = event.data;
  
  // Handle custom functions called by the assistant
  switch (functionName) {
    case 'lookupCustomer':
      const customer = await prisma.customer.findUnique({
        where: { phone: parameters.phone },
      });
      return NextResponse.json({
        result: customer || { error: 'Customer not found' },
      });
      
    case 'scheduleAppointment':
      const appointment = await prisma.appointment.create({
        data: {
          customerId: parameters.customerId,
          date: new Date(parameters.date),
          type: parameters.type,
        },
      });
      return NextResponse.json({
        result: { success: true, appointmentId: appointment.id },
      });
      
    default:
      return NextResponse.json({
        result: { error: 'Unknown function' },
      });
  }
}
```

### VAPI Phone Number Integration
```typescript
// /app/api/vapi/phone-numbers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { vapi } from '@/lib/vapi/config';

// Purchase phone number
export async function POST(request: NextRequest) {
  try {
    const { areaCode, country } = await request.json();
    
    // Search for available numbers
    const availableNumbers = await vapi.phoneNumbers.search({
      country: country || 'US',
      areaCode,
      limit: 10,
    });
    
    if (availableNumbers.length === 0) {
      return NextResponse.json(
        { error: 'No numbers available' },
        { status: 404 }
      );
    }
    
    // Purchase the first available number
    const phoneNumber = await vapi.phoneNumbers.purchase({
      number: availableNumbers[0].number,
      assistantId: process.env.VAPI_ASSISTANT_ID,
    });
    
    // Save to database
    await prisma.phoneNumber.create({
      data: {
        number: phoneNumber.number,
        provider: 'vapi',
        providerId: phoneNumber.id,
        status: 'active',
      },
    });
    
    return NextResponse.json(phoneNumber);
  } catch (error) {
    console.error('Error purchasing phone number:', error);
    return NextResponse.json(
      { error: 'Failed to purchase number' },
      { status: 500 }
    );
  }
}

// List phone numbers
export async function GET(request: NextRequest) {
  try {
    const phoneNumbers = await vapi.phoneNumbers.list();
    return NextResponse.json(phoneNumbers);
  } catch (error) {
    console.error('Error listing phone numbers:', error);
    return NextResponse.json(
      { error: 'Failed to list numbers' },
      { status: 500 }
    );
  }
}
```

---

## 2. Twilio Complete Integration Suite {#twilio-integration}

### Installation & Configuration
```bash
# Install Twilio SDK and related packages
pnpm add twilio twilio-video @twilio/conversations @twilio/voice-sdk
pnpm add -D @types/twilio-video
```

### Twilio Service Configuration
```typescript
// /lib/twilio/config.ts
import twilio from 'twilio';

export const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID!,
  authToken: process.env.TWILIO_AUTH_TOKEN!,
  apiKey: process.env.TWILIO_API_KEY!,
  apiSecret: process.env.TWILIO_API_SECRET!,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER!,
  whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER!,
  messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID!,
  verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID!,
  twimlAppSid: process.env.TWILIO_TWIML_APP_SID!,
  pushCredentialSid: process.env.TWILIO_PUSH_CREDENTIAL_SID!,
};

// Initialize Twilio client
export const twilioClient = twilio(
  twilioConfig.accountSid,
  twilioConfig.authToken
);

// Twilio services
export const twilioServices = {
  messaging: twilioClient.messages,
  verify: twilioClient.verify.v2.services(twilioConfig.verifyServiceSid),
  lookups: twilioClient.lookups.v2,
  conversations: twilioClient.conversations.v1,
  video: twilioClient.video.v1,
  voice: twilioClient.calls,
};
```

### SMS & WhatsApp Messaging
```typescript
// /lib/twilio/messaging.ts
import { twilioClient, twilioConfig } from './config';
import { prisma } from '@/lib/prisma';

interface SendSMSOptions {
  to: string;
  body: string;
  mediaUrl?: string[];
  scheduledAt?: Date;
  statusCallback?: string;
}

export async function sendSMS({
  to,
  body,
  mediaUrl,
  scheduledAt,
  statusCallback,
}: SendSMSOptions) {
  try {
    const messageOptions: any = {
      body,
      to,
      from: twilioConfig.phoneNumber,
      statusCallback: statusCallback || `${process.env.NEXT_PUBLIC_APP_URL}/api/twilio/status`,
    };
    
    if (mediaUrl) {
      messageOptions.mediaUrl = mediaUrl;
    }
    
    if (scheduledAt) {
      messageOptions.sendAt = scheduledAt.toISOString();
      messageOptions.scheduleType = 'fixed';
      messageOptions.messagingServiceSid = twilioConfig.messagingServiceSid;
      delete messageOptions.from;
    }
    
    const message = await twilioClient.messages.create(messageOptions);
    
    // Log message to database
    await prisma.message.create({
      data: {
        sid: message.sid,
        to: message.to,
        from: message.from,
        body: message.body,
        status: message.status,
        direction: 'outbound',
        channel: 'sms',
        price: message.price,
        priceUnit: message.priceUnit,
      },
    });
    
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

export async function sendWhatsApp({
  to,
  body,
  mediaUrl,
  templateSid,
  templateData,
}: {
  to: string;
  body?: string;
  mediaUrl?: string[];
  templateSid?: string;
  templateData?: Record<string, any>;
}) {
  try {
    const whatsappNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const fromNumber = `whatsapp:${twilioConfig.whatsappNumber}`;
    
    let messageOptions: any = {
      to: whatsappNumber,
      from: fromNumber,
    };
    
    if (templateSid) {
      // Use WhatsApp template
      messageOptions.contentSid = templateSid;
      messageOptions.contentVariables = JSON.stringify(templateData);
    } else {
      messageOptions.body = body;
      if (mediaUrl) {
        messageOptions.mediaUrl = mediaUrl;
      }
    }
    
    const message = await twilioClient.messages.create(messageOptions);
    
    await prisma.message.create({
      data: {
        sid: message.sid,
        to: message.to,
        from: message.from,
        body: message.body || 'Template message',
        status: message.status,
        direction: 'outbound',
        channel: 'whatsapp',
      },
    });
    
    return message;
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    throw error;
  }
}

// Batch messaging
export async function sendBulkSMS(
  recipients: string[],
  body: string,
  options?: {
    personalizations?: Map<string, any>;
    throttle?: number; // messages per second
  }
) {
  const results = [];
  const throttle = options?.throttle || 10;
  const delay = 1000 / throttle;
  
  for (const recipient of recipients) {
    try {
      const personalizedBody = options?.personalizations?.get(recipient)
        ? body.replace(/\{\{(\w+)\}\}/g, (match, key) => 
            options.personalizations!.get(recipient)[key] || match
          )
        : body;
      
      const message = await sendSMS({
        to: recipient,
        body: personalizedBody,
      });
      
      results.push({ success: true, recipient, messageSid: message.sid });
      
      // Throttle requests
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      results.push({ success: false, recipient, error: (error as Error).message });
    }
  }
  
  return results;
}
```

### Phone Number Verification
```typescript
// /lib/twilio/verify.ts
import { twilioServices } from './config';

export async function sendVerificationCode(
  to: string,
  channel: 'sms' | 'call' | 'email' | 'whatsapp' = 'sms'
) {
  try {
    const verification = await twilioServices.verify
      .verifications
      .create({
        to,
        channel,
        locale: 'en',
      });
    
    return {
      success: true,
      status: verification.status,
      valid: verification.valid,
    };
  } catch (error) {
    console.error('Error sending verification:', error);
    throw error;
  }
}

export async function verifyCode(to: string, code: string) {
  try {
    const verificationCheck = await twilioServices.verify
      .verificationChecks
      .create({
        to,
        code,
      });
    
    return {
      success: verificationCheck.status === 'approved',
      status: verificationCheck.status,
      valid: verificationCheck.valid,
    };
  } catch (error) {
    console.error('Error verifying code:', error);
    return {
      success: false,
      status: 'failed',
      valid: false,
    };
  }
}

// React component for verification
export function VerificationFlow() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const sendCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/twilio/verify/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      
      if (response.ok) {
        setCodeSent(true);
        toast.success('Verification code sent!');
      }
    } catch (error) {
      toast.error('Failed to send code');
    } finally {
      setLoading(false);
    }
  };
  
  const verifyPhone = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/twilio/verify/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code: verificationCode }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Phone verified successfully!');
        // Handle successful verification
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {!codeSent ? (
        <>
          <Input
            type="tel"
            placeholder="+1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
          />
          <Button onClick={sendCode} disabled={loading}>
            Send Verification Code
          </Button>
        </>
      ) : (
        <>
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            disabled={loading}
          />
          <Button onClick={verifyPhone} disabled={loading}>
            Verify
          </Button>
        </>
      )}
    </div>
  );
}
```

### Twilio Video Integration
```typescript
// /lib/twilio/video.ts
import { connect, Room, LocalVideoTrack, LocalAudioTrack } from 'twilio-video';
import { twilioConfig } from './config';

export class VideoRoom {
  private room: Room | null = null;
  private localVideoTrack: LocalVideoTrack | null = null;
  private localAudioTrack: LocalAudioTrack | null = null;
  
  async generateToken(identity: string, roomName: string): Promise<string> {
    const response = await fetch('/api/twilio/video/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity, roomName }),
    });
    
    const { token } = await response.json();
    return token;
  }
  
  async joinRoom(
    token: string,
    roomName: string,
    localVideoElement?: HTMLVideoElement,
    remoteVideoContainer?: HTMLDivElement
  ) {
    try {
      // Create local tracks
      const localTracks = await this.createLocalTracks();
      
      // Connect to room
      this.room = await connect(token, {
        name: roomName,
        tracks: localTracks,
        audio: true,
        video: { width: 640, height: 480 },
        networkQuality: {
          local: 1,
          remote: 1,
        },
        maxAudioBitrate: 16000,
        preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
      });
      
      // Display local video
      if (localVideoElement && this.localVideoTrack) {
        this.localVideoTrack.attach(localVideoElement);
      }
      
      // Handle participants
      this.room.participants.forEach(participant => {
        this.handleParticipant(participant, remoteVideoContainer);
      });
      
      this.room.on('participantConnected', participant => {
        this.handleParticipant(participant, remoteVideoContainer);
      });
      
      this.room.on('participantDisconnected', participant => {
        this.removeParticipant(participant.sid);
      });
      
      return this.room;
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }
  
  private async createLocalTracks() {
    const tracks = [];
    
    try {
      this.localVideoTrack = await createLocalVideoTrack({
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
        frameRate: 24,
      });
      tracks.push(this.localVideoTrack);
    } catch (error) {
      console.error('Error creating video track:', error);
    }
    
    try {
      this.localAudioTrack = await createLocalAudioTrack({
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      });
      tracks.push(this.localAudioTrack);
    } catch (error) {
      console.error('Error creating audio track:', error);
    }
    
    return tracks;
  }
  
  private handleParticipant(participant: any, container?: HTMLDivElement) {
    const participantDiv = document.createElement('div');
    participantDiv.id = participant.sid;
    participantDiv.className = 'participant';
    
    participant.tracks.forEach((publication: any) => {
      if (publication.isSubscribed) {
        this.handleTrack(publication.track, participantDiv);
      }
    });
    
    participant.on('trackSubscribed', (track: any) => {
      this.handleTrack(track, participantDiv);
    });
    
    if (container) {
      container.appendChild(participantDiv);
    }
  }
  
  private handleTrack(track: any, container: HTMLDivElement) {
    if (track.kind === 'video' || track.kind === 'audio') {
      const element = track.attach();
      container.appendChild(element);
    }
  }
  
  private removeParticipant(sid: string) {
    const participantDiv = document.getElementById(sid);
    if (participantDiv) {
      participantDiv.remove();
    }
  }
  
  async disconnect() {
    if (this.room) {
      this.room.disconnect();
      this.room = null;
    }
    
    if (this.localVideoTrack) {
      this.localVideoTrack.stop();
      this.localVideoTrack = null;
    }
    
    if (this.localAudioTrack) {
      this.localAudioTrack.stop();
      this.localAudioTrack = null;
    }
  }
  
  toggleAudio(enabled: boolean) {
    if (this.localAudioTrack) {
      if (enabled) {
        this.localAudioTrack.enable();
      } else {
        this.localAudioTrack.disable();
      }
    }
  }
  
  toggleVideo(enabled: boolean) {
    if (this.localVideoTrack) {
      if (enabled) {
        this.localVideoTrack.enable();
      } else {
        this.localVideoTrack.disable();
      }
    }
  }
}

// React component for video calls
export function VideoCall({ roomName, userName }: { roomName: string; userName: string }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const videoRoom = useRef<VideoRoom>(new VideoRoom());
  
  const joinCall = async () => {
    try {
      const token = await videoRoom.current.generateToken(userName, roomName);
      await videoRoom.current.joinRoom(
        token,
        roomName,
        localVideoRef.current!,
        remoteVideoRef.current!
      );
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to join call:', error);
      toast.error('Failed to join video call');
    }
  };
  
  const leaveCall = async () => {
    await videoRoom.current.disconnect();
    setIsConnected(false);
  };
  
  const toggleAudio = () => {
    videoRoom.current.toggleAudio(!isAudioEnabled);
    setIsAudioEnabled(!isAudioEnabled);
  };
  
  const toggleVideo = () => {
    videoRoom.current.toggleVideo(!isVideoEnabled);
    setIsVideoEnabled(!isVideoEnabled);
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-64 bg-black rounded-lg"
          />
          <span className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
            You
          </span>
        </div>
        <div ref={remoteVideoRef} className="remote-participants" />
      </div>
      
      <div className="flex justify-center space-x-2">
        {!isConnected ? (
          <Button onClick={joinCall}>Join Call</Button>
        ) : (
          <>
            <Button
              onClick={toggleAudio}
              variant={isAudioEnabled ? "secondary" : "destructive"}
            >
              {isAudioEnabled ? <Mic /> : <MicOff />}
            </Button>
            <Button
              onClick={toggleVideo}
              variant={isVideoEnabled ? "secondary" : "destructive"}
            >
              {isVideoEnabled ? <Video /> : <VideoOff />}
            </Button>
            <Button onClick={leaveCall} variant="destructive">
              Leave Call
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
```

---

## 3. SendGrid Email Service {#sendgrid-integration}

### Installation & Setup
```bash
# Install SendGrid packages
pnpm add @sendgrid/mail @sendgrid/client @sendgrid/eventwebhook
pnpm add @react-email/components @react-email/render
```

### SendGrid Configuration
```typescript
// /lib/sendgrid/config.ts
import sgMail from '@sendgrid/mail';
import sgClient from '@sendgrid/client';
import { EventWebhook } from '@sendgrid/eventwebhook';

export const sendGridConfig = {
  apiKey: process.env.SENDGRID_API_KEY!,
  fromEmail: process.env.SENDGRID_FROM_EMAIL!,
  fromName: process.env.SENDGRID_FROM_NAME!,
  replyToEmail: process.env.SENDGRID_REPLY_TO_EMAIL!,
  webhookVerificationKey: process.env.SENDGRID_WEBHOOK_VERIFICATION_KEY!,
  templateIds: {
    welcome: process.env.SENDGRID_WELCOME_TEMPLATE_ID!,
    passwordReset: process.env.SENDGRID_PASSWORD_RESET_TEMPLATE_ID!,
    invoice: process.env.SENDGRID_INVOICE_TEMPLATE_ID!,
    newsletter: process.env.SENDGRID_NEWSLETTER_TEMPLATE_ID!,
  },
  lists: {
    newsletter: process.env.SENDGRID_NEWSLETTER_LIST_ID!,
    customers: process.env.SENDGRID_CUSTOMERS_LIST_ID!,
  },
  unsubscribeGroups: {
    marketing: parseInt(process.env.SENDGRID_MARKETING_UNSUBSCRIBE_GROUP_ID!),
    transactional: parseInt(process.env.SENDGRID_TRANSACTIONAL_UNSUBSCRIBE_GROUP_ID!),
  },
};

// Initialize SendGrid
sgMail.setApiKey(sendGridConfig.apiKey);
sgClient.setApiKey(sendGridConfig.apiKey);

export const sendGrid = {
  mail: sgMail,
  client: sgClient,
  webhook: new EventWebhook(),
};
```

### Email Templates with React Email
```typescript
// /emails/welcome-email.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  userEmail: string;
  verificationUrl: string;
  loginUrl: string;
}

export default function WelcomeEmail({
  userName,
  userEmail,
  verificationUrl,
  loginUrl,
}: WelcomeEmailProps) {
  const previewText = `Welcome to our platform, ${userName}!`;
  
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-20 px-4">
            <Img
              src="https://your-domain.com/logo.png"
              width="150"
              height="50"
              alt="Logo"
              className="mx-auto"
            />
            
            <Heading className="text-3xl font-bold text-center text-gray-900 mt-8">
              Welcome to Our Platform!
            </Heading>
            
            <Text className="text-base text-gray-600 mt-4">
              Hi {userName},
            </Text>
            
            <Text className="text-base text-gray-600">
              We're excited to have you on board! Your account has been created
              successfully with the email address: {userEmail}
            </Text>
            
            <Section className="text-center mt-8">
              <Button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                href={verificationUrl}
              >
                Verify Your Email
              </Button>
            </Section>
            
            <Text className="text-sm text-gray-500 mt-8">
              If the button doesn't work, copy and paste this link into your browser:
            </Text>
            <Link href={verificationUrl} className="text-blue-600 text-sm break-all">
              {verificationUrl}
            </Link>
            
            <Hr className="border-gray-300 my-8" />
            
            <Section className="bg-gray-50 rounded-lg p-6">
              <Heading className="text-xl font-semibold text-gray-900">
                Getting Started
              </Heading>
              <Text className="text-gray-600 mt-2">
                Here are some things you can do to get started:
              </Text>
              <ul className="mt-4 space-y-2">
                <li className="text-gray-600">✓ Complete your profile</li>
                <li className="text-gray-600">✓ Connect your integrations</li>
                <li className="text-gray-600">✓ Invite team members</li>
                <li className="text-gray-600">✓ Explore our features</li>
              </ul>
              <Button
                className="bg-gray-900 text-white px-4 py-2 rounded-lg mt-4"
                href={loginUrl}
              >
                Go to Dashboard
              </Button>
            </Section>
            
            <Text className="text-xs text-gray-500 text-center mt-8">
              © 2024 Your Company. All rights reserved.
              <br />
              123 Main St, City, State 12345
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
```

### SendGrid Email Service
```typescript
// /lib/sendgrid/email-service.ts
import { render } from '@react-email/render';
import { sendGrid, sendGridConfig } from './config';
import WelcomeEmail from '@/emails/welcome-email';
import { prisma } from '@/lib/prisma';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }>;
  categories?: string[];
  sendAt?: number;
  batchId?: string;
  asm?: {
    groupId: number;
    groupsToDisplay?: number[];
  };
  mailSettings?: {
    sandboxMode?: { enable: boolean };
  };
  trackingSettings?: {
    clickTracking?: { enable: boolean };
    openTracking?: { enable: boolean };
    subscriptionTracking?: { enable: boolean };
  };
}

export async function sendEmail(options: EmailOptions) {
  try {
    const msg = {
      to: options.to,
      from: {
        email: sendGridConfig.fromEmail,
        name: sendGridConfig.fromName,
      },
      replyTo: sendGridConfig.replyToEmail,
      subject: options.subject,
      ...options,
    };
    
    const response = await sendGrid.mail.send(msg);
    
    // Log email to database
    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    for (const recipient of recipients) {
      await prisma.emailLog.create({
        data: {
          to: recipient,
          subject: options.subject,
          templateId: options.templateId,
          status: 'sent',
          messageId: response[0].headers['x-message-id'],
          sendGridId: response[0].headers['x-sendgrid-message-id'],
        },
      });
    }
    
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Log failed email
    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    for (const recipient of recipients) {
      await prisma.emailLog.create({
        data: {
          to: recipient,
          subject: options.subject,
          templateId: options.templateId,
          status: 'failed',
          error: (error as Error).message,
        },
      });
    }
    
    throw error;
  }
}

// Send welcome email
export async function sendWelcomeEmail(
  user: { email: string; name: string; id: string }
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${user.id}`;
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`;
  
  const html = render(
    WelcomeEmail({
      userName: user.name,
      userEmail: user.email,
      verificationUrl,
      loginUrl,
    })
  );
  
  return sendEmail({
    to: user.email,
    subject: `Welcome to Our Platform, ${user.name}!`,
    html,
    categories: ['welcome', 'onboarding'],
    asm: {
      groupId: sendGridConfig.unsubscribeGroups.marketing,
    },
    trackingSettings: {
      clickTracking: { enable: true },
      openTracking: { enable: true },
    },
  });
}

// Send bulk emails with personalization
export async function sendBulkEmail(
  recipients: Array<{ email: string; data: Record<string, any> }>,
  templateId: string,
  subject: string,
  options?: {
    sendAt?: Date;
    batchId?: string;
    categories?: string[];
  }
) {
  const personalizations = recipients.map(recipient => ({
    to: recipient.email,
    dynamicTemplateData: recipient.data,
  }));
  
  const msg = {
    personalizations,
    from: {
      email: sendGridConfig.fromEmail,
      name: sendGridConfig.fromName,
    },
    templateId,
    subject,
    sendAt: options?.sendAt ? Math.floor(options.sendAt.getTime() / 1000) : undefined,
    batchId: options?.batchId,
    categories: options?.categories,
    asm: {
      groupId: sendGridConfig.unsubscribeGroups.marketing,
    },
  };
  
  try {
    const response = await sendGrid.mail.send(msg);
    
    // Log bulk send
    await prisma.bulkEmailJob.create({
      data: {
        templateId,
        subject,
        recipientCount: recipients.length,
        status: 'completed',
        batchId: options?.batchId,
        sendAt: options?.sendAt,
      },
    });
    
    return response;
  } catch (error) {
    console.error('Error sending bulk email:', error);
    
    await prisma.bulkEmailJob.create({
      data: {
        templateId,
        subject,
        recipientCount: recipients.length,
        status: 'failed',
        error: (error as Error).message,
        batchId: options?.batchId,
        sendAt: options?.sendAt,
      },
    });
    
    throw error;
  }
}
```

### SendGrid Contact Management
```typescript
// /lib/sendgrid/contacts.ts
import { sendGrid, sendGridConfig } from './config';

export async function addContactToList(
  email: string,
  firstName?: string,
  lastName?: string,
  customFields?: Record<string, any>
) {
  try {
    const data = {
      list_ids: [sendGridConfig.lists.newsletter],
      contacts: [
        {
          email,
          first_name: firstName,
          last_name: lastName,
          custom_fields: customFields,
        },
      ],
    };
    
    const request = {
      url: '/v3/marketing/contacts',
      method: 'PUT' as const,
      body: data,
    };
    
    const [response] = await sendGrid.client.request(request);
    return response.body;
  } catch (error) {
    console.error('Error adding contact:', error);
    throw error;
  }
}

export async function searchContacts(query: string) {
  try {
    const request = {
      url: '/v3/marketing/contacts/search',
      method: 'POST' as const,
      body: {
        query,
      },
    };
    
    const [response] = await sendGrid.client.request(request);
    return response.body;
  } catch (error) {
    console.error('Error searching contacts:', error);
    throw error;
  }
}

export async function updateContactPreferences(
  email: string,
  preferences: {
    marketingEmails?: boolean;
    productUpdates?: boolean;
    newsletter?: boolean;
  }
) {
  try {
    // Get contact ID
    const contacts = await searchContacts(`email LIKE '${email}'`);
    if (!contacts.result || contacts.result.length === 0) {
      throw new Error('Contact not found');
    }
    
    const contactId = contacts.result[0].id;
    
    // Update suppression groups
    const suppressions = [];
    if (!preferences.marketingEmails) {
      suppressions.push(sendGridConfig.unsubscribeGroups.marketing);
    }
    
    if (suppressions.length > 0) {
      const request = {
        url: `/v3/asm/suppressions/global`,
        method: 'POST' as const,
        body: {
          recipient_emails: [email],
        },
      };
      
      await sendGrid.client.request(request);
    }
    
    return { success: true, contactId };
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
}
```

---

## 4. AWS Services Integration {#aws-integration}

### AWS SDK Installation
```bash
# Install AWS SDK v3
pnpm add @aws-sdk/client-s3 @aws-sdk/client-ses @aws-sdk/client-sns
pnpm add @aws-sdk/client-lambda @aws-sdk/client-dynamodb @aws-sdk/client-sqs
pnpm add @aws-sdk/client-cognito-identity-provider @aws-sdk/client-rekognition
pnpm add @aws-sdk/s3-request-presigner @aws-sdk/cloudfront-signer
```

### AWS Configuration
```typescript
// /lib/aws/config.ts
import { S3Client } from '@aws-sdk/client-s3';
import { SESClient } from '@aws-sdk/client-ses';
import { SNSClient } from '@aws-sdk/client-sns';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SQSClient } from '@aws-sdk/client-sqs';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { RekognitionClient } from '@aws-sdk/client-rekognition';

const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

// Initialize AWS clients
export const awsClients = {
  s3: new S3Client(awsConfig),
  ses: new SESClient(awsConfig),
  sns: new SNSClient(awsConfig),
  lambda: new LambdaClient(awsConfig),
  dynamodb: new DynamoDBClient(awsConfig),
  sqs: new SQSClient(awsConfig),
  cognito: new CognitoIdentityProviderClient(awsConfig),
  rekognition: new RekognitionClient(awsConfig),
};

export const awsResources = {
  s3: {
    bucketName: process.env.AWS_S3_BUCKET!,
    region: process.env.AWS_REGION!,
    cloudFrontUrl: process.env.AWS_CLOUDFRONT_URL!,
  },
  ses: {
    fromEmail: process.env.AWS_SES_FROM_EMAIL!,
    configurationSet: process.env.AWS_SES_CONFIGURATION_SET!,
  },
  sns: {
    topicArn: process.env.AWS_SNS_TOPIC_ARN!,
  },
  sqs: {
    queueUrl: process.env.AWS_SQS_QUEUE_URL!,
  },
  cognito: {
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
    clientId: process.env.AWS_COGNITO_CLIENT_ID!,
  },
  lambda: {
    functionPrefix: process.env.AWS_LAMBDA_FUNCTION_PREFIX!,
  },
};
```

### S3 File Upload Service
```typescript
// /lib/aws/s3-service.ts
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { awsClients, awsResources } from './config';
import crypto from 'crypto';

interface UploadOptions {
  file: Buffer | Uint8Array | string;
  key: string;
  contentType: string;
  metadata?: Record<string, string>;
  acl?: 'private' | 'public-read';
  serverSideEncryption?: boolean;
  expiresIn?: number;
}

export async function uploadToS3({
  file,
  key,
  contentType,
  metadata,
  acl = 'private',
  serverSideEncryption = true,
}: UploadOptions) {
  try {
    const command = new PutObjectCommand({
      Bucket: awsResources.s3.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
      Metadata: metadata,
      ACL: acl,
      ServerSideEncryption: serverSideEncryption ? 'AES256' : undefined,
    });
    
    const response = await awsClients.s3.send(command);
    
    // Generate URL
    const url = acl === 'public-read'
      ? `https://${awsResources.s3.bucketName}.s3.${awsResources.s3.region}.amazonaws.com/${key}`
      : await getSignedUrl(awsClients.s3, new GetObjectCommand({
          Bucket: awsResources.s3.bucketName,
          Key: key,
        }), { expiresIn: 3600 });
    
    return {
      key,
      url,
      etag: response.ETag,
      versionId: response.VersionId,
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}

// Generate presigned upload URL for client-side uploads
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
) {
  const command = new PutObjectCommand({
    Bucket: awsResources.s3.bucketName,
    Key: key,
    ContentType: contentType,
  });
  
  const url = await getSignedUrl(awsClients.s3, command, { expiresIn });
  
  return {
    url,
    key,
    fields: {
      'Content-Type': contentType,
    },
  };
}

// Multipart upload for large files
export class MultipartUpload {
  private uploadId: string | null = null;
  private parts: Array<{ ETag: string; PartNumber: number }> = [];
  
  async initiate(key: string, contentType: string) {
    const { UploadId } = await awsClients.s3.send(
      new CreateMultipartUploadCommand({
        Bucket: awsResources.s3.bucketName,
        Key: key,
        ContentType: contentType,
      })
    );
    
    this.uploadId = UploadId!;
    return this.uploadId;
  }
  
  async uploadPart(
    key: string,
    partNumber: number,
    body: Buffer | Uint8Array
  ) {
    if (!this.uploadId) {
      throw new Error('Upload not initiated');
    }
    
    const { ETag } = await awsClients.s3.send(
      new UploadPartCommand({
        Bucket: awsResources.s3.bucketName,
        Key: key,
        PartNumber: partNumber,
        UploadId: this.uploadId,
        Body: body,
      })
    );
    
    this.parts.push({ ETag: ETag!, PartNumber: partNumber });
    return ETag;
  }
  
  async complete(key: string) {
    if (!this.uploadId) {
      throw new Error('Upload not initiated');
    }
    
    const response = await awsClients.s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: awsResources.s3.bucketName,
        Key: key,
        UploadId: this.uploadId,
        MultipartUpload: {
          Parts: this.parts.sort((a, b) => a.PartNumber - b.PartNumber),
        },
      })
    );
    
    this.uploadId = null;
    this.parts = [];
    
    return response;
  }
  
  async abort(key: string) {
    if (!this.uploadId) return;
    
    await awsClients.s3.send(
      new AbortMultipartUploadCommand({
        Bucket: awsResources.s3.bucketName,
        Key: key,
        UploadId: this.uploadId,
      })
    );
    
    this.uploadId = null;
    this.parts = [];
  }
}

// React component for S3 file upload
export function S3FileUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    
    try {
      // Get presigned URL from backend
      const response = await fetch('/api/aws/s3/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });
      
      const { url, key } = await response.json();
      
      // Upload directly to S3
      await axios.put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!
          );
          setProgress(percentCompleted);
        },
      });
      
      const fileUrl = `${awsResources.s3.cloudFrontUrl}/${key}`;
      onUpload(fileUrl);
      
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };
  
  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleFileSelect}
        disabled={uploading}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
```

### AWS Lambda Integration
```typescript
// /lib/aws/lambda-service.ts
import { InvokeCommand, InvokeAsyncCommand } from '@aws-sdk/client-lambda';
import { awsClients, awsResources } from './config';

interface LambdaInvokeOptions {
  functionName: string;
  payload: any;
  invocationType?: 'RequestResponse' | 'Event' | 'DryRun';
  logType?: 'None' | 'Tail';
  qualifier?: string;
}

export async function invokeLambda({
  functionName,
  payload,
  invocationType = 'RequestResponse',
  logType = 'None',
  qualifier,
}: LambdaInvokeOptions) {
  try {
    const command = new InvokeCommand({
      FunctionName: `${awsResources.lambda.functionPrefix}-${functionName}`,
      InvocationType: invocationType,
      LogType: logType,
      Payload: JSON.stringify(payload),
      Qualifier: qualifier,
    });
    
    const response = await awsClients.lambda.send(command);
    
    if (response.Payload) {
      const result = JSON.parse(new TextDecoder().decode(response.Payload));
      
      if (response.FunctionError) {
        throw new Error(`Lambda error: ${result.errorMessage}`);
      }
      
      return result;
    }
    
    return null;
  } catch (error) {
    console.error('Error invoking Lambda:', error);
    throw error;
  }
}

// Async Lambda invocation for background tasks
export async function invokeLambdaAsync(
  functionName: string,
  payload: any
) {
  try {
    const command = new InvokeAsyncCommand({
      FunctionName: `${awsResources.lambda.functionPrefix}-${functionName}`,
      InvokeArgs: JSON.stringify(payload),
    });
    
    const response = await awsClients.lambda.send(command);
    return response;
  } catch (error) {
    console.error('Error invoking Lambda async:', error);
    throw error;
  }
}

// Lambda function for image processing
export async function processImage(imageUrl: string, operations: any[]) {
  return invokeLambda({
    functionName: 'image-processor',
    payload: {
      imageUrl,
      operations,
      outputBucket: awsResources.s3.bucketName,
    },
  });
}

// Lambda function for data processing
export async function processDataBatch(data: any[], processingType: string) {
  return invokeLambdaAsync('batch-processor', {
    data,
    processingType,
    timestamp: Date.now(),
  });
}
```

---

## 5. MCP (Model Context Protocol) Integration {#mcp-integration}

### MCP Server Setup
```typescript
// /lib/mcp/server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Define your MCP tools
const TOOLS = {
  query_database: {
    description: 'Query the application database',
    inputSchema: z.object({
      query: z.string().describe('SQL query to execute'),
      params: z.array(z.any()).optional().describe('Query parameters'),
    }),
  },
  send_notification: {
    description: 'Send a notification to users',
    inputSchema: z.object({
      userId: z.string().describe('User ID to notify'),
      message: z.string().describe('Notification message'),
      type: z.enum(['email', 'sms', 'push']).describe('Notification type'),
    }),
  },
  analyze_data: {
    description: 'Analyze data using AI',
    inputSchema: z.object({
      data: z.any().describe('Data to analyze'),
      analysisType: z.string().describe('Type of analysis to perform'),
    }),
  },
  execute_workflow: {
    description: 'Execute a predefined workflow',
    inputSchema: z.object({
      workflowId: z.string().describe('Workflow ID to execute'),
      parameters: z.record(z.any()).optional().describe('Workflow parameters'),
    }),
  },
};

// Define your MCP resources
const RESOURCES = {
  'database://users': {
    name: 'Users Database',
    description: 'Access to user data',
    mimeType: 'application/json',
  },
  'database://products': {
    name: 'Products Database',
    description: 'Access to product catalog',
    mimeType: 'application/json',
  },
  'api://external': {
    name: 'External APIs',
    description: 'Access to integrated external services',
    mimeType: 'application/json',
  },
};

export class MCPServer {
  private server: Server;
  
  constructor() {
    this.server = new Server(
      {
        name: 'fullstack-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );
    
    this.setupHandlers();
  }
  
  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: Object.entries(TOOLS).map(([name, tool]) => ({
        name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    }));
    
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: Object.entries(RESOURCES).map(([uri, resource]) => ({
        uri,
        ...resource,
      })),
    }));
    
    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      switch (name) {
        case 'query_database':
          return this.queryDatabase(args);
          
        case 'send_notification':
          return this.sendNotification(args);
          
        case 'analyze_data':
          return this.analyzeData(args);
          
        case 'execute_workflow':
          return this.executeWorkflow(args);
          
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
    
    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      
      if (uri.startsWith('database://')) {
        return this.readDatabase(uri);
      } else if (uri.startsWith('api://')) {
        return this.readAPI(uri);
      }
      
      throw new Error(`Unknown resource: ${uri}`);
    });
  }
  
  private async queryDatabase(args: any) {
    const { query, params } = args;
    
    try {
      // Execute database query
      const result = await prisma.$queryRawUnsafe(query, ...(params || []));
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  }
  
  private async sendNotification(args: any) {
    const { userId, message, type } = args;
    
    try {
      let result;
      
      switch (type) {
        case 'email':
          result = await sendEmail({
            to: userId, // Assume userId is email for simplicity
            subject: 'Notification',
            html: message,
          });
          break;
          
        case 'sms':
          result = await sendSMS({
            to: userId, // Assume userId is phone for simplicity
            body: message,
          });
          break;
          
        case 'push':
          result = await sendPushNotification(userId, message);
          break;
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Notification sent successfully: ${JSON.stringify(result)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error sending notification: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  }
  
  private async analyzeData(args: any) {
    const { data, analysisType } = args;
    
    try {
      // Call your AI service for analysis
      const result = await callOpenAI({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Perform ${analysisType} analysis on the provided data.`,
          },
          {
            role: 'user',
            content: JSON.stringify(data),
          },
        ],
      });
      
      return {
        content: [
          {
            type: 'text',
            text: result.choices[0].message.content,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error analyzing data: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  }
  
  private async executeWorkflow(args: any) {
    const { workflowId, parameters } = args;
    
    try {
      // Execute workflow using your workflow engine
      const result = await workflowEngine.execute(workflowId, parameters);
      
      return {
        content: [
          {
            type: 'text',
            text: `Workflow executed: ${JSON.stringify(result)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error executing workflow: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  }
  
  private async readDatabase(uri: string) {
    const table = uri.replace('database://', '');
    
    try {
      const data = await prisma[table].findMany({ take: 100 });
      
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to read database: ${(error as Error).message}`);
    }
  }
  
  private async readAPI(uri: string) {
    const endpoint = uri.replace('api://', '');
    
    try {
      // Fetch from external API
      const response = await fetch(`https://api.example.com/${endpoint}`);
      const data = await response.json();
      
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to read API: ${(error as Error).message}`);
    }
  }
  
  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('MCP Server started');
  }
}

// Start the MCP server
if (require.main === module) {
  const server = new MCPServer();
  server.start().catch(console.error);
}
```

### MCP Client Integration
```typescript
// /lib/mcp/client.ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

export class MCPClient {
  private client: Client;
  private transport: StdioClientTransport;
  
  constructor() {
    this.client = new Client(
      {
        name: 'fullstack-app-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );
  }
  
  async connect(serverPath: string) {
    const serverProcess = spawn('node', [serverPath]);
    this.transport = new StdioClientTransport({
      command: 'node',
      args: [serverPath],
    });
    
    await this.client.connect(this.transport);
    console.log('Connected to MCP server');
  }
  
  async listTools() {
    const response = await this.client.request({
      method: 'tools/list',
      params: {},
    });
    
    return response.tools;
  }
  
  async callTool(name: string, args: any) {
    const response = await this.client.request({
      method: 'tools/call',
      params: {
        name,
        arguments: args,
      },
    });
    
    return response.content;
  }
  
  async listResources() {
    const response = await this.client.request({
      method: 'resources/list',
      params: {},
    });
    
    return response.resources;
  }
  
  async readResource(uri: string) {
    const response = await this.client.request({
      method: 'resources/read',
      params: { uri },
    });
    
    return response.contents;
  }
  
  async disconnect() {
    await this.client.close();
    this.transport.close();
  }
}

// React hook for MCP
export function useMCP() {
  const [client, setClient] = useState<MCPClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [tools, setTools] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  
  useEffect(() => {
    const mcpClient = new MCPClient();
    
    mcpClient.connect('/path/to/mcp-server.js')
      .then(async () => {
        setClient(mcpClient);
        setConnected(true);
        
        const [toolsList, resourcesList] = await Promise.all([
          mcpClient.listTools(),
          mcpClient.listResources(),
        ]);
        
        setTools(toolsList);
        setResources(resourcesList);
      })
      .catch(console.error);
    
    return () => {
      mcpClient.disconnect();
    };
  }, []);
  
  const executeTool = useCallback(async (toolName: string, args: any) => {
    if (!client) throw new Error('MCP client not connected');
    return client.callTool(toolName, args);
  }, [client]);
  
  const fetchResource = useCallback(async (uri: string) => {
    if (!client) throw new Error('MCP client not connected');
    return client.readResource(uri);
  }, [client]);
  
  return {
    connected,
    tools,
    resources,
    executeTool,
    fetchResource,
  };
}
```

---

## 6. Marketing Tools Integration {#marketing-tools}

### HubSpot Integration
```typescript
// /lib/hubspot/client.ts
import { Client } from '@hubspot/api-client';

export const hubspotClient = new Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

export class HubSpotService {
  async createOrUpdateContact(email: string, properties: any) {
    try {
      const response = await hubspotClient.crm.contacts.basicApi.create({
        properties: {
          email,
          ...properties,
        },
      });
      
      return response;
    } catch (error: any) {
      if (error.code === 409) {
        // Contact exists, update instead
        const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'email',
                  operator: 'EQ',
                  value: email,
                },
              ],
            },
          ],
        });
        
        if (searchResponse.results.length > 0) {
          const contactId = searchResponse.results[0].id;
          return await hubspotClient.crm.contacts.basicApi.update(contactId, {
            properties,
          });
        }
      }
      
      throw error;
    }
  }
  
  async trackEvent(email: string, eventName: string, properties: any) {
    const response = await fetch('https://api.hubapi.com/events/v3/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        email,
        eventName,
        properties,
        occurredAt: Date.now(),
      }),
    });
    
    return response.json();
  }
  
  async addToWorkflow(email: string, workflowId: string) {
    const contact = await this.createOrUpdateContact(email, {});
    
    const response = await fetch(
      `https://api.hubapi.com/automation/v2/workflows/${workflowId}/enrollments/contacts/${contact.id}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        },
      }
    );
    
    return response.json();
  }
}
```

### Mailchimp Integration
```typescript
// /lib/mailchimp/client.ts
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export class MailchimpService {
  async addSubscriber(email: string, listId: string, tags: string[] = []) {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: email,
        status: 'subscribed',
        tags,
      });
      
      return response;
    } catch (error) {
      console.error('Mailchimp error:', error);
      throw error;
    }
  }
  
  async createCampaign(options: {
    listId: string;
    subject: string;
    fromName: string;
    replyTo: string;
    templateId: number;
  }) {
    const campaign = await mailchimp.campaigns.create({
      type: 'regular',
      recipients: {
        list_id: options.listId,
      },
      settings: {
        subject_line: options.subject,
        from_name: options.fromName,
        reply_to: options.replyTo,
        template_id: options.templateId,
      },
    });
    
    return campaign;
  }
  
  async sendCampaign(campaignId: string) {
    return await mailchimp.campaigns.send(campaignId);
  }
}
```

### Google Analytics 4 Integration
```typescript
// /lib/analytics/ga4.ts
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA4_CLIENT_EMAIL,
    private_key: process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export class GA4Service {
  private propertyId = process.env.GA4_PROPERTY_ID;
  
  async getRealtimeData() {
    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${this.propertyId}`,
      dimensions: [
        { name: 'country' },
        { name: 'city' },
        { name: 'deviceCategory' },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
      ],
    });
    
    return response;
  }
  
  async getTrafficSources(startDate: string, endDate: string) {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${this.propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'sessionSource' },
        { name: 'sessionMedium' },
        { name: 'sessionCampaignName' },
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    });
    
    return response;
  }
  
  async trackEvent(clientId: string, events: any[]) {
    const measurementId = process.env.GA4_MEASUREMENT_ID;
    const apiSecret = process.env.GA4_API_SECRET;
    
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: clientId,
          events,
        }),
      }
    );
    
    return response.ok;
  }
}

// Client-side GA4 tracking
export function GA4Script() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
```

---

## 7. Payment Processing Systems {#payment-systems}

### Stripe Integration
```typescript
// /lib/stripe/client.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export class StripeService {
  async createCustomer(email: string, metadata?: any) {
    return await stripe.customers.create({
      email,
      metadata,
    });
  }
  
  async createCheckoutSession(options: {
    customerId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    mode: 'payment' | 'subscription';
  }) {
    return await stripe.checkout.sessions.create({
      customer: options.customerId,
      line_items: [
        {
          price: options.priceId,
          quantity: 1,
        },
      ],
      mode: options.mode,
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      allow_promotion_codes: true,
    });
  }
  
  async createPaymentIntent(amount: number, currency: string = 'usd') {
    return await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }
  
  async createSubscription(customerId: string, priceId: string) {
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });
  }
  
  async handleWebhook(payload: string, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
      
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
          
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object);
          break;
          
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCanceled(event.data.object);
          break;
          
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
      }
      
      return { received: true };
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw error;
    }
  }
  
  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    await prisma.payment.create({
      data: {
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'succeeded',
        customerId: paymentIntent.customer as string,
      },
    });
  }
  
  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      create: {
        stripeSubscriptionId: subscription.id,
        customerId: subscription.customer as string,
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
      update: {
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }
  
  private async handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'canceled',
        canceledAt: new Date(),
      },
    });
  }
  
  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    // Send payment failed email
    await sendEmail({
      to: invoice.customer_email!,
      subject: 'Payment Failed',
      templateId: 'payment_failed',
      dynamicTemplateData: {
        amount: invoice.amount_due / 100,
        currency: invoice.currency,
      },
    });
  }
}
```

---

## 8. Analytics & Monitoring {#analytics-monitoring}

### Mixpanel Integration
```typescript
// /lib/analytics/mixpanel.ts
import Mixpanel from 'mixpanel';

const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN!, {
  host: 'api-eu.mixpanel.com', // Use EU servers if needed
});

export class MixpanelService {
  track(distinctId: string, event: string, properties?: any) {
    mixpanel.track(event, {
      distinct_id: distinctId,
      ...properties,
      time: Date.now(),
    });
  }
  
  identify(distinctId: string, properties: any) {
    mixpanel.people.set(distinctId, properties);
  }
  
  alias(distinctId: string, alias: string) {
    mixpanel.alias(distinctId, alias);
  }
  
  increment(distinctId: string, property: string, by: number = 1) {
    mixpanel.people.increment(distinctId, property, by);
  }
  
  trackRevenue(distinctId: string, amount: number) {
    mixpanel.people.track_charge(distinctId, amount);
  }
}

// React hook for Mixpanel
export function useMixpanel() {
  const { user } = useAuth();
  
  const track = useCallback((event: string, properties?: any) => {
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track(event, {
        ...properties,
        userId: user?.id,
      });
    }
  }, [user]);
  
  const identify = useCallback(() => {
    if (typeof window !== 'undefined' && window.mixpanel && user) {
      window.mixpanel.identify(user.id);
      window.mixpanel.people.set({
        $email: user.email,
        $name: user.name,
        $created: user.createdAt,
      });
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      identify();
    }
  }, [user, identify]);
  
  return { track, identify };
}
```

### Sentry Error Monitoring
```typescript
// /lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    debug: process.env.NODE_ENV === 'development',
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    integrations: [
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    beforeSend(event, hint) {
      if (event.exception) {
        // Custom error handling
        console.error('Sentry Error:', event.exception);
      }
      return event;
    },
  });
}

// Error boundary component
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={resetError}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Try again
          </button>
        </div>
      )}
      showDialog
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

// Custom error logging
export function logError(error: Error, context?: any) {
  Sentry.captureException(error, {
    contexts: {
      custom: context,
    },
  });
}
```

---

## 9. Real-time Communication {#realtime-communication}

### Pusher Integration
```typescript
// /lib/realtime/pusher.ts
import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// Client-side Pusher
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: '/api/pusher/auth',
  }
);

// React hook for Pusher
export function usePusher(channelName: string) {
  const [channel, setChannel] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    const pusherChannel = pusherClient.subscribe(channelName);
    
    pusherChannel.bind('pusher:subscription_succeeded', () => {
      setConnected(true);
    });
    
    pusherChannel.bind('pusher:subscription_error', (error: any) => {
      console.error('Pusher subscription error:', error);
      setConn