"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);

    const supabase = createClient();
    await supabase.auth.signOut();

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <Button
      disabled={isPending}
      onClick={handleSignOut}
      size="md"
      variant="secondary"
    >
      {isPending ? "Saindo..." : "Sair"}
    </Button>
  );
}
