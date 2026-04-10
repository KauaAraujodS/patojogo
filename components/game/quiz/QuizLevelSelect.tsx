"use client";

import Link from "next/link";
import {
  quizLevelConfigs,
  quizLevelOrder,
  type QuizProgressSnapshot,
} from "@/data/questions";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { cn } from "@/lib/cn";
import {
  getQuizLevelProgress,
  getQuizLevelRequirementLabel,
  getQuizLevelSlug,
  getQuizStars,
  isQuizLevelUnlocked,
} from "@/utils/quizHelpers";

type QuizLevelSelectProps = {
  initialProgress: QuizProgressSnapshot;
};

export function QuizLevelSelect({ initialProgress }: QuizLevelSelectProps) {
  const { progress } = useQuizProgress(initialProgress);

  return (
    <section className="flex min-h-[100dvh] items-center justify-center px-4">
      <div className="grid w-full max-w-[28rem] gap-4">
        {quizLevelOrder.map((level) => {
          const config = quizLevelConfigs[level];
          const levelProgress = getQuizLevelProgress(progress, level);
          const unlocked = isQuizLevelUnlocked(progress, level);
          const stars = getQuizStars(levelProgress.averageAccuracy);

          const content = (
            <div className="flex w-full flex-col items-center gap-1.5 text-center">
              <span className="text-xl font-semibold tracking-tight text-white">
                {config.icon} {config.label}
              </span>
              <span className="text-xs text-white/78">
                {unlocked
                  ? levelProgress.completedCount > 0
                    ? `${levelProgress.averageAccuracy}% de acerto • ${"★".repeat(stars) || "Sem estrelas ainda"}`
                    : "Desbloqueado"
                  : getQuizLevelRequirementLabel(level)}
              </span>
            </div>
          );

          if (!unlocked) {
            return (
              <div
                key={level}
                className="flex min-h-16 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-4 opacity-72"
              >
                {content}
              </div>
            );
          }

          return (
            <Link
              key={level}
              className={cn(
                "flex min-h-16 items-center justify-center rounded-[1.5rem] border px-4 py-4 shadow-[0_18px_44px_rgba(13,14,45,0.22)] transition-transform duration-200 hover:-translate-y-0.5",
                "border-[#ffb327] bg-gradient-to-r",
                config.buttonGradient,
              )}
              href={`/jogar/quiz-guiado/${getQuizLevelSlug(level)}`}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
