"use client";

import { createClient } from "@v1/supabase/client";
import { DropdownMenuItem } from "@v1/ui/dropdown-menu";
import { Icons } from "@v1/ui/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOut() {
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);

    await supabase.auth.signOut({
      scope: "local",
    });

    router.push("/login");
  };
  return (
    <DropdownMenuItem onClick={handleSignOut}>
      <Icons.SignOut className="size-4 mr-2" />
      <span>{isLoading ? "Loading..." : "Sign out"}</span>
    </DropdownMenuItem>
  );
}
