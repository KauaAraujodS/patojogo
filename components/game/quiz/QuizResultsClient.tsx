"use client";

import type {
  QuizAttemptRecord,
  QuizLevel,
  QuizProgressSnapshot,
} from "@/data/questions";
import { QuizResults } from "@/components/game/quiz/QuizResults";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { getStoredQuizAttemptById } from "@/lib/quiz/client";

type QuizResultsClientProps = {
  attemptId?: string;
  initialAttempt: QuizAttemptRecord | null;
  initialProgress: QuizProgressSnapshot;
  level: QuizLevel;
  userId: string;
};

export function QuizResultsClient({
  attemptId,
  initialAttempt,
  initialProgress,
  level,
  userId,
}: QuizResultsClientProps) {
  const { progress } = useQuizProgress(initialProgress);
  const attempt =
    typeof window !== "undefined" && attemptId
      ? getStoredQuizAttemptById(userId, level, attemptId) ?? initialAttempt
      : initialAttempt;

  if (!attempt) {
    return (
      <section className="mx-auto flex min-h-[100dvh] w-full max-w-3xl items-center px-4 py-8 sm:px-6">
        <div className="w-full rounded-[2rem] border border-dashed border-white/10 bg-[#12205b]/36 p-6 text-white">
          Nenhuma rodada encontrada para esse nivel.
        </div>
      </section>
    );
  }

  return <QuizResults attempt={attempt} progress={progress} />;
}
