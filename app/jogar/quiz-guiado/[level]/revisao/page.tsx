import { notFound, redirect } from "next/navigation";
import { QuizReviewClient } from "@/components/game/quiz/QuizReviewClient";
import type { QuizReviewFilter } from "@/data/questions";
import { getQuizAttemptById, getQuizLatestAttemptForUser, getQuizProgressSnapshotForUser } from "@/lib/quiz/server";
import { createClient } from "@/lib/supabase/server";
import { getQuizLevelFromSlug, isQuizLevelUnlocked } from "@/utils/quizHelpers";

type QuizReviewPageProps = {
  params: Promise<{
    level: string;
  }>;
  searchParams: Promise<{
    attempt?: string;
    filter?: string;
  }>;
};

function normalizeFilter(filter: string | undefined): QuizReviewFilter {
  if (
    filter === "correct" ||
    filter === "incorrect" ||
    filter === "skipped"
  ) {
    return filter;
  }

  return "all";
}

export default async function QuizReviewPage({
  params,
  searchParams,
}: QuizReviewPageProps) {
  const [{ level: levelSlug }, { attempt: attemptId, filter }] = await Promise.all([
    params,
    searchParams,
  ]);
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

  const attempt = attemptId
    ? await getQuizAttemptById(supabase, user.id, attemptId)
    : await getQuizLatestAttemptForUser(supabase, user.id, level);
  const backHref = attemptId
    ? `/jogar/quiz-guiado/${levelSlug}/resultado?attempt=${attemptId}`
    : `/jogar/quiz-guiado/${levelSlug}`;

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,rgba(103,141,255,0.24),transparent_22%),linear-gradient(180deg,#1e2f83_0%,#223da9_54%,#202a87_100%)] text-white">
      <QuizReviewClient
        attemptId={attemptId}
        backHref={backHref}
        defaultFilter={normalizeFilter(filter)}
        initialAttempt={attempt}
        initialProgress={progress}
        level={level}
        userId={user.id}
      />
    </main>
  );
}
