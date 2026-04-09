"use client";

import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type SignOutButtonProps = Pick<
  ComponentProps<typeof Button>,
  "className" | "size" | "variant"
> & {
  label?: string;
};

export function SignOutButton({
  className,
  label = "Sair",
  size = "md",
  variant = "secondary",
}: SignOutButtonProps) {
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
      className={className}
      disabled={isPending}
      onClick={handleSignOut}
      size={size}
      variant={variant}
    >
      {isPending ? "Saindo..." : label}
    </Button>
  );
}
