import type { EmailOtpType } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

import { updateUser } from "@v1/supabase/mutations";
import { createClient } from "@v1/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = createClient();

    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      console.log("verified", type, data);

      if (type === "email_change" && data.user) {
        console.log("updating user email", data.user.email, data.user.id);
        await updateUser(supabase, { email: data.user.email });
        revalidatePath(`user_${data.user.id}`);
      }

      redirect(next);
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/auth/auth-code-error");
}
