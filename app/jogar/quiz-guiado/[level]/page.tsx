import { notFound, redirect } from "next/navigation";
import { QuizOverview } from "@/components/game/quiz/QuizOverview";
import { createClient } from "@/lib/supabase/server";
import { buildDefaultQuizProgress, getQuizLevelFromSlug } from "@/utils/quizHelpers";

type QuizOverviewPageProps = {
  params: Promise<{
    level: string;
  }>;
};

export default async function QuizOverviewPage({
  params,
}: QuizOverviewPageProps) {
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

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,rgba(103,141,255,0.24),transparent_22%),linear-gradient(180deg,#1e2f83_0%,#223da9_54%,#202a87_100%)]">
      <QuizOverview
        initialProgress={buildDefaultQuizProgress(user.id)}
        level={level}
      />
    </main>
  );
}
