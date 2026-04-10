import { quizLevelConfigs, type QuizAttemptSummary } from "@/data/questions";
import { formatQuizDuration } from "@/utils/quizHelpers";

type QuizResultsProps = {
  summary: QuizAttemptSummary;
};

export function QuizResults({ summary }: QuizResultsProps) {
  const config = quizLevelConfigs[summary.level];

  return (
    <section className="rounded-[1.8rem] border border-white/10 bg-[#12205b]/36 p-5 text-white shadow-[0_20px_45px_rgba(10,12,40,0.22)]">
      <p className="text-sm text-[#d7e5ff]">{config.icon} Quiz concluido</p>
      <h2 className="mt-3 text-[2rem] font-semibold tracking-tight">
        {summary.accuracy}% de desempenho
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ResultItem label="Acertos" value={`${summary.correctCount}/${summary.totalQuestions}`} />
        <ResultItem label="Erros" value={`${summary.incorrectCount}`} />
        <ResultItem label="Puladas" value={`${summary.skippedCount}`} />
        <ResultItem label="Tempo total" value={formatQuizDuration(summary.totalTimeInSeconds)} />
        <ResultItem label="Moedas" value={`${summary.earnedCoins}`} />
        <ResultItem label="Pontos" value={`${summary.earnedPoints}`} />
      </div>
    </section>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
