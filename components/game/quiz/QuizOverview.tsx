"use client";

import Link from "next/link";
import {
  quizLevelConfigs,
  type QuizLevel,
  type QuizProgressSnapshot,
} from "@/data/questions";
import { QuizStats } from "@/components/game/quiz/QuizStats";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { cn } from "@/lib/cn";
import {
  getQuizLevelProgress,
  getQuizLevelSlug,
  getQuizSeedQuestionCount,
} from "@/utils/quizHelpers";

type QuizOverviewProps = {
  initialProgress: QuizProgressSnapshot;
  level: QuizLevel;
};

export function QuizOverview({ initialProgress, level }: QuizOverviewProps) {
  const { progress } = useQuizProgress(initialProgress);
  const config = quizLevelConfigs[level];
  const levelProgress = getQuizLevelProgress(progress, level);
  const progressWidth = Math.min(levelProgress.completionPercentage, 100);
  const seedCount = getQuizSeedQuestionCount(level);

  return (
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-[32rem] flex-col px-4 py-4 text-white">
      <div
        className={cn(
          "rounded-[2rem] bg-gradient-to-r px-5 py-6 shadow-[0_28px_60px_rgba(20,18,66,0.3)]",
          config.buttonGradient,
        )}
      >
        <p className="text-sm text-white/84">{config.icon} Modo {config.label}</p>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-tight text-white sm:text-[2.45rem]">
          Quiz guiado
        </h1>
        <p className="mt-3 max-w-[24rem] text-[0.96rem] leading-7 text-white/88">
          {config.description}
        </p>
      </div>

      <div className="mt-4 space-y-4 rounded-[1.8rem] border border-white/10 bg-[#12205b]/36 p-5 shadow-[0_20px_45px_rgba(10,12,40,0.22)]">
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoItem label="Questoes planejadas" value={`${config.questionCount}`} />
          <InfoItem label="Banco inicial criado" value={`${seedCount}`} />
          <InfoItem label="Recompensa por acerto" value={`${config.pointsPerCorrect} pts`} />
          <InfoItem label="Recompensa total alvo" value={config.rewardText} />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 text-sm text-[#d7e5ff]">
            <span>Progresso do nivel</span>
            <span>{levelProgress.completionPercentage}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#f6c24d,#ffe28b)] transition-all duration-300"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-[#c8d5ff]">
            {levelProgress.completedCount} de {config.questionCount} questoes ja registradas.
          </p>
        </div>

        <QuizStats level={level} progress={levelProgress} />

        <div className="rounded-[1.35rem] border border-white/10 bg-[#0f1742]/52 p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
            Tipos de questao
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {config.questionTypes.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs text-white/88"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <Link
            className={cn(
              "inline-flex min-h-13 items-center justify-center rounded-[1.2rem] border px-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(17,20,58,0.22)] transition-transform duration-200 hover:-translate-y-0.5",
              "border-[#ffb327] bg-gradient-to-r",
              config.buttonGradient,
            )}
            href={`/jogar/quiz-guiado/${getQuizLevelSlug(level)}/questao`}
          >
            Iniciar quiz
          </Link>
          <button
            className="min-h-12 rounded-[1.2rem] border border-white/10 bg-white/7 px-4 text-sm font-semibold text-white/84"
            type="button"
          >
            Revisar acertos
          </button>
          <button
            className="min-h-12 rounded-[1.2rem] border border-white/10 bg-white/7 px-4 text-sm font-semibold text-white/84"
            type="button"
          >
            Revisar erros
          </button>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/7 px-4 text-sm font-semibold text-white/84"
            href="/jogar/quiz-guiado"
          >
            Voltar
          </Link>
        </div>
      </div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
