"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  quizLevelConfigs,
  type QuizAttemptRecord,
  type QuizLevel,
  type QuizProgressSnapshot,
} from "@/data/questions";
import { QuizStats } from "@/components/game/quiz/QuizStats";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { cn } from "@/lib/cn";
import {
  formatQuizDuration,
  getQuizLevelMaxCoins,
  getQuizLevelMaxScore,
  getQuizLevelProgress,
  getQuizLevelSlug,
  getQuizSeedQuestionCount,
} from "@/utils/quizHelpers";

type QuizOverviewProps = {
  initialAttempt: QuizAttemptRecord | null;
  initialProgress: QuizProgressSnapshot;
  level: QuizLevel;
};

export function QuizOverview({
  initialAttempt,
  initialProgress,
  level,
}: QuizOverviewProps) {
  const { progress } = useQuizProgress(initialProgress);
  const config = quizLevelConfigs[level];
  const levelProgress = getQuizLevelProgress(progress, level);
  const progressWidth = Math.min(levelProgress.completionPercentage, 100);
  const quizHref = `/jogar/quiz-guiado/${getQuizLevelSlug(level)}/questao`;
  const reviewHref = initialAttempt
    ? `/jogar/quiz-guiado/${getQuizLevelSlug(level)}/revisao?attempt=${initialAttempt.id}`
    : `/jogar/quiz-guiado/${getQuizLevelSlug(level)}/revisao`;

  return (
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-5xl items-center px-4 py-8 sm:px-6">
      <div className="grid w-full gap-5 lg:grid-cols-[1.28fr,0.92fr]">
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.35 }}
        >
          <div
            className={cn(
              "rounded-[2rem] bg-gradient-to-r px-6 py-6 text-white shadow-[0_28px_60px_rgba(20,18,66,0.3)]",
              config.buttonGradient,
            )}
          >
            <p className="text-sm text-white/84">{config.icon} Modo {config.label}</p>
            <h1 className="mt-3 text-[2rem] font-semibold tracking-tight sm:text-[2.7rem]">
              Quiz guiado
            </h1>
            <p className="mt-3 max-w-[28rem] text-[0.96rem] leading-7 text-white/88">
              {config.description}
            </p>
          </div>

          <div className="mt-4 space-y-4 rounded-[1.8rem] border border-white/10 bg-[#12205b]/36 p-5 shadow-[0_20px_45px_rgba(10,12,40,0.22)]">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem label="Questoes" value={`${config.questionCount}`} />
              <InfoItem label="Sem limite" value="Tempo livre" />
              <InfoItem
                label="Recompensa maxima"
                value={`${getQuizLevelMaxCoins(level)} moedas`}
              />
              <InfoItem
                label="Pontuacao maxima"
                value={`${getQuizLevelMaxScore(level)} pts`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 text-sm text-[#d7e5ff]">
                <span>Progresso no nivel</span>
                <span>{levelProgress.completionPercentage}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#f6c24d,#ffe28b)] transition-all duration-300"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-[#c8d5ff]">
                {levelProgress.completedCount} de {config.questionCount} questoes
                registradas. Banco atual: {getQuizSeedQuestionCount(level)} questoes.
              </p>
            </div>

            <QuizStats level={level} progress={levelProgress} />

            <div className="rounded-[1.35rem] border border-white/10 bg-[#0f1742]/52 p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
                Tipos de questao
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from(new Set(config.questionTypes)).map((item) => (
                  <span
                    className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs text-white/88"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.aside
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 18 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="space-y-4 rounded-[1.8rem] border border-white/10 bg-[#12205b]/36 p-5 text-white shadow-[0_20px_45px_rgba(10,12,40,0.22)]"
        >
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
              Ultima rodada
            </p>
            {initialAttempt ? (
              <div className="mt-3 rounded-[1.25rem] border border-white/10 bg-[#0f1742]/55 p-4">
                <p className="text-2xl font-semibold text-white">
                  {initialAttempt.summary.accuracy}%
                </p>
                <p className="mt-1 text-sm text-[#d7e5ff]">
                  {initialAttempt.summary.correctCount} acertos •{" "}
                  {formatQuizDuration(initialAttempt.summary.totalTimeInSeconds)}
                </p>
              </div>
            ) : (
              <div className="mt-3 rounded-[1.25rem] border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-[#c8d5ff]">
                Nenhuma rodada concluida ainda nesse nivel.
              </div>
            )}
          </div>

          <div className="grid gap-3">
            <Link
              className={cn(
                "inline-flex min-h-13 items-center justify-center rounded-[1.2rem] border px-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(17,20,58,0.22)] transition-transform duration-200 hover:-translate-y-0.5",
                "border-[#ffb327] bg-gradient-to-r",
                config.buttonGradient,
              )}
              href={quizHref}
            >
              Iniciar quiz
            </Link>
            <Link
              className={cn(
                "inline-flex min-h-12 items-center justify-center rounded-[1.2rem] border px-4 text-sm font-semibold",
                initialAttempt
                  ? "border-white/10 bg-white/7 text-white/84"
                  : "pointer-events-none border-white/10 bg-white/5 text-white/35",
              )}
              href={`${reviewHref}&filter=correct`}
            >
              Revisar acertos
            </Link>
            <Link
              className={cn(
                "inline-flex min-h-12 items-center justify-center rounded-[1.2rem] border px-4 text-sm font-semibold",
                initialAttempt
                  ? "border-white/10 bg-white/7 text-white/84"
                  : "pointer-events-none border-white/10 bg-white/5 text-white/35",
              )}
              href={`${reviewHref}&filter=incorrect`}
            >
              Revisar erros
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/7 px-4 text-sm font-semibold text-white/84"
              href="/jogar/quiz-guiado/estatisticas"
            >
              Ver estatisticas
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/7 px-4 text-sm font-semibold text-white/84"
              href="/jogar/quiz-guiado"
            >
              Voltar
            </Link>
          </div>
        </motion.aside>
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
