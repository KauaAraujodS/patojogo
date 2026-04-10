import { AuthPanel } from "@/components/auth/auth-panel";
import { GameShell } from "@/components/game/game-shell";
import type { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

type Profile = Pick<
  Tables<"profiles">,
  "coins" | "email" | "full_name" | "phone" | "progress_step" | "score"
>;

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("coins, email, full_name, phone, progress_step, score")
      .eq("id", user.id)
      .maybeSingle();

    profile = data;
  }

  return <main>{!profile ? <AuthPanel /> : <GameShell profile={profile} />}</main>;
}
