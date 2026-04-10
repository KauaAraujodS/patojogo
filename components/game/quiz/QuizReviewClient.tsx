"use client";

import type {
  QuizAttemptRecord,
  QuizLevel,
  QuizProgressSnapshot,
  QuizReviewFilter,
} from "@/data/questions";
import { QuizReview } from "@/components/game/quiz/QuizReview";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { getStoredQuizAttemptById } from "@/lib/quiz/client";

type QuizReviewClientProps = {
  attemptId?: string;
  backHref: string;
  defaultFilter?: QuizReviewFilter;
  initialAttempt: QuizAttemptRecord | null;
  initialProgress: QuizProgressSnapshot;
  level: QuizLevel;
  userId: string;
};

export function QuizReviewClient({
  attemptId,
  backHref,
  defaultFilter,
  initialAttempt,
  initialProgress,
  level,
  userId,
}: QuizReviewClientProps) {
  useQuizProgress(initialProgress);

  const attempt =
    typeof window !== "undefined" && attemptId
      ? getStoredQuizAttemptById(userId, level, attemptId) ?? initialAttempt
      : initialAttempt;

  if (!attempt) {
    return (
      <section className="mx-auto flex min-h-[100dvh] w-full max-w-3xl items-center px-4 py-8 sm:px-6">
        <div className="w-full rounded-[2rem] border border-dashed border-white/10 bg-[#12205b]/36 p-6 text-white">
          Nenhuma revisao disponivel ainda nesse nivel.
        </div>
      </section>
    );
  }

  return (
    <QuizReview
      attempt={attempt}
      backHref={backHref}
      defaultFilter={defaultFilter}
    />
  );
}
