import {
  type QuizAttemptRecord,
  type QuizCategory,
  type QuizLevel,
  type QuizLevelProgress,
  type QuizProgressSnapshot,
} from "@/data/questions";
import { cn } from "@/lib/cn";
import {
  formatQuizDuration,
  getQuizCategoryLabel,
  getQuizLevelLabel,
  getQuizLevelMaxScore,
  getQuizStars,
} from "@/utils/quizHelpers";

type QuizStatsProps =
  | {
      level: QuizLevel;
      progress: QuizLevelProgress;
      variant?: "level";
    }
  | {
      latestAttempts?: Partial<Record<QuizLevel, QuizAttemptRecord | null>>;
      progress: QuizProgressSnapshot;
      variant: "overall";
    };

export function QuizStats(props: QuizStatsProps) {
  if (props.variant === "overall") {
    const { latestAttempts, progress } = props;
    const totalCoins = Object.values(progress.levelProgress).reduce(
      (accumulator, levelProgress) => accumulator + levelProgress.totalCoins,
      0,
    );
    const totalPoints = Object.values(progress.levelProgress).reduce(
      (accumulator, levelProgress) => accumulator + levelProgress.totalScore,
      0,
    );
    const completedCount = Object.values(progress.levelProgress).reduce(
      (accumulator, levelProgress) => accumulator + levelProgress.completedCount,
      0,
    );

    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Pontos totais" value={`${totalPoints}`} />
          <StatCard label="Moedas totais" value={`${totalCoins}`} />
          <StatCard label="Questoes registradas" value={`${completedCount}`} />
        </div>

        <div className="grid gap-3">
          {(["beginner", "intermediate", "advanced"] as QuizLevel[]).map((level) => {
            const levelProgress = progress.levelProgress[level];
            const latestAttempt = latestAttempts?.[level] ?? null;

            return (
              <div
                className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4"
                key={level}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {getQuizLevelLabel(level)}
                    </p>
                    <p className="text-xs text-[#c6d4ff]">
                      Melhor desempenho {levelProgress.averageAccuracy}% •{" "}
                      {getQuizStars(levelProgress.averageAccuracy) || 0} estrelas
                    </p>
                  </div>
                  <div className="text-right text-xs text-[#9fb5ff]">
                    <p>{levelProgress.completedCount} registradas</p>
                    <p>{levelProgress.totalCoins} moedas</p>
                  </div>
                </div>

                {latestAttempt ? (
                  <div className="mt-3 rounded-[1rem] border border-white/10 bg-[#0e1848]/60 p-3 text-sm text-[#e7ecff]">
                    <p>
                      Ultima rodada: {latestAttempt.summary.accuracy}% em{" "}
                      {formatQuizDuration(latestAttempt.summary.totalTimeInSeconds)}
                    </p>
                    <p className="mt-1 text-[#bcd0ff]">
                      Melhor categoria:{" "}
                      {latestAttempt.summary.bestCategory
                        ? getQuizCategoryLabel(
                            latestAttempt.summary.bestCategory as QuizCategory,
                          )
                        : "Ainda sem destaque"}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const { level, progress } = props;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <StatCard
        label="Melhor pontuacao"
        value={`${progress.bestScore}/${getQuizLevelMaxScore(level)}`}
      />
      <StatCard label="Melhor precisao" value={`${progress.averageAccuracy}%`} />
      <StatCard
        label="Estrelas"
        value={getQuizStars(progress.averageAccuracy) > 0
          ? "★".repeat(getQuizStars(progress.averageAccuracy))
          : "Sem estrelas"}
      />
    </div>
  );
}

function StatCard({
  className,
  label,
  value,
}: {
  className?: string;
  label: string;
  value: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.2rem] border border-white/10 bg-[#12205b]/40 p-4",
        className,
      )}
    >
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
