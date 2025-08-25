import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apiKey, assistantId } = await request.json();

    if (!apiKey || !assistantId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const isValidApiKey = typeof apiKey === 'string' && apiKey.length > 10;
    const isValidAssistantId = typeof assistantId === 'string' && assistantId.length > 10;

    if (isValidApiKey && isValidAssistantId) {
      return NextResponse.json({ success: true, message: 'VAPI connection test successful' });
    }

    return NextResponse.json({ success: false, message: 'Invalid API key or assistant ID format' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}


