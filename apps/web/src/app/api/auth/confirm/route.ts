import type { EmailOtpType } from "@supabase/supabase-js";
import { updateUser } from "@v1/supabase/mutations";
import { createClient } from "@v1/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code || token_hash) {
    const supabase = createClient();

    let error = null;
    let data = null;

    if (code) {
      const codeResult = await supabase.auth.exchangeCodeForSession(code);
      error = codeResult.error;
      data = codeResult.data;
    } else if (token_hash && type) {
      const tokenResult = await supabase.auth.verifyOtp({
        token_hash,
        type,
      });
      error = tokenResult.error;
      data = tokenResult.data;
    }

    if (!error) {
      if (type === "email_change" && data?.user) {
        await updateUser(supabase, { email: data.user.email });
        revalidatePath(`user_${data.user.id}`);
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}?error=auth-code-error`);
}
