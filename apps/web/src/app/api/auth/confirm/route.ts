import { createLoopsContact } from "@/lib/loops";
import type { EmailOtpType } from "@supabase/supabase-js";
import { updateUser } from "@v1/supabase/mutations";
import { getUserQuery } from "@v1/supabase/queries";
import { createClient } from "@v1/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  
  const next =
    searchParams.get("next") ?? searchParams.get("return_to") ?? "/dashboard";

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
      if ((type === "email" || type === "signup") && data?.user) {
        const userData = await getUserQuery(supabase, data.user.id);
        const user = userData.data;

        if (user && !user.crm_id) {
          try {
            const loopsContact = await createLoopsContact({
              email: user.email,
              firstName: user.full_name?.split(" ")[0] ?? "unknown",
              lastName:
                user.full_name?.split(" ").slice(1).join(" ") ?? "unknown",
              role: user.role,
              phoneNumber: user.phone_number ?? "unknown",
            });

            if (loopsContact?.id) {
              await updateUser(supabase, { crm_id: loopsContact.id });
              console.log(
                `Created Loops contact ${loopsContact.id} for user ${user.id}`,
              );
            }
          } catch (error) {
            console.error("Failed to create Loops contact:", error);
            // Don't fail the auth flow if CRM integration fails
          }
        }
      }

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
