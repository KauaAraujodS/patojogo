import { redirect } from "next/navigation";
import { QuizLevelSelect } from "@/components/game/quiz/QuizLevelSelect";
import { createClient } from "@/lib/supabase/server";
import { buildDefaultQuizProgress } from "@/utils/quizHelpers";

export default async function QuizGuiadoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,rgba(103,141,255,0.24),transparent_22%),linear-gradient(180deg,#1e2f83_0%,#223da9_54%,#202a87_100%)] text-white">
      <QuizLevelSelect initialProgress={buildDefaultQuizProgress(user.id)} />
    </main>
  );
}
