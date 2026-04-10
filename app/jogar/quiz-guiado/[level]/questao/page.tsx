import { notFound, redirect } from "next/navigation";
import { QuizPlaySession } from "@/components/game/quiz/QuizPlaySession";
import type { Tables } from "@/lib/database.types";
import { getQuizProgressSnapshotForUser } from "@/lib/quiz/server";
import { createClient } from "@/lib/supabase/server";
import { getQuizLevelFromSlug, isQuizLevelUnlocked } from "@/utils/quizHelpers";

type Profile = Pick<Tables<"profiles">, "coins">;

type QuizQuestionPageProps = {
  params: Promise<{
    level: string;
  }>;
};

export default async function QuizQuestionPage({
  params,
}: QuizQuestionPageProps) {
  const { level: levelSlug } = await params;
  const level = getQuizLevelFromSlug(levelSlug);

  if (!level) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const progress = await getQuizProgressSnapshotForUser(supabase, user.id);

  if (!isQuizLevelUnlocked(progress, level)) {
    redirect("/jogar/quiz-guiado");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("coins")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,rgba(103,141,255,0.24),transparent_22%),linear-gradient(180deg,#1e2f83_0%,#223da9_54%,#202a87_100%)] text-white">
      <QuizPlaySession
        initialCoins={profile?.coins ?? 0}
        initialProgress={progress}
        level={level}
        userId={user.id}
      />
    </main>
  );
}
