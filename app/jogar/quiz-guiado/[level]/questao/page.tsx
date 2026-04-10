import { notFound, redirect } from "next/navigation";
import { QuizQuestion } from "@/components/game/quiz/QuizQuestion";
import { createClient } from "@/lib/supabase/server";
import {
  buildDefaultQuizProgress,
  getQuizLevelFromSlug,
  getQuizLevelQuestions,
} from "@/utils/quizHelpers";

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

  const progress = buildDefaultQuizProgress(user.id);
  const questions = getQuizLevelQuestions(level);
  const firstQuestion = questions[0];

  if (!firstQuestion) {
    notFound();
  }

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,rgba(103,141,255,0.24),transparent_22%),linear-gradient(180deg,#1e2f83_0%,#223da9_54%,#202a87_100%)] px-4 py-4">
      <div className="mx-auto w-full max-w-[32rem]">
        <QuizQuestion
          coinBalance={progress.levelProgress[level].totalCoins}
          index={0}
          question={firstQuestion}
          total={questions.length}
        />
      </div>
    </main>
  );
}
