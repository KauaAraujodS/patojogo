import { quizLevelConfigs, type QuizLevel, type QuizLevelProgress } from "@/data/questions";
import { getQuizStars } from "@/utils/quizHelpers";

type QuizStatsProps = {
  level: QuizLevel;
  progress: QuizLevelProgress;
};

export function QuizStats({ level, progress }: QuizStatsProps) {
  const stars = getQuizStars(progress.averageAccuracy);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-[1.35rem] border border-white/10 bg-[#12205b]/40 p-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
          Melhor pontuacao
        </p>
        <p className="mt-2 text-2xl font-semibold text-white">
          {progress.bestScore}/{quizLevelConfigs[level].questionCount * quizLevelConfigs[level].pointsPerCorrect}
        </p>
      </div>
      <div className="rounded-[1.35rem] border border-white/10 bg-[#12205b]/40 p-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
          Precisao
        </p>
        <p className="mt-2 text-2xl font-semibold text-white">
          {progress.averageAccuracy}%
        </p>
      </div>
      <div className="rounded-[1.35rem] border border-white/10 bg-[#12205b]/40 p-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
          Estrelas
        </p>
        <p className="mt-2 text-2xl font-semibold text-white">
          {stars > 0 ? "★".repeat(stars) : "Sem estrelas"}
        </p>
      </div>
    </div>
  );
}
