import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@v1/supabase/server";

export async function GET(request: NextRequest) {
  try {
    console.log('=== Debug Auth Endpoint ===');
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Check cookies
    const cookieHeader = request.headers.get('cookie');
    console.log('Cookie header:', cookieHeader);
    
    // Try to create Supabase client
    const supabase = createClient();
    console.log('Supabase client created');
    
    // Try to get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session result:', { 
      hasSession: !!session, 
      hasError: !!sessionError,
      errorMessage: sessionError?.message 
    });
    
    // Try to get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('User result:', { 
      hasUser: !!user, 
      userId: user?.id, 
      hasError: !!userError,
      errorMessage: userError?.message 
    });
    
    if (userError || !user) {
      return NextResponse.json(
        { 
          error: "Authentication failed",
          sessionError: sessionError?.message,
          userError: userError?.message,
          hasSession: !!session,
          hasUser: !!user
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Authentication successful",
        userId: user.id,
        email: user.email,
        hasSession: !!session
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Debug auth error:", error);
    return NextResponse.json(
      { 
        error: "Debug auth failed",
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
