"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  quizLevelConfigs,
  type QuizCategory,
  type QuizAttemptRecord,
  type QuizProgressSnapshot,
} from "@/data/questions";
import {
  formatQuizDuration,
  getQuizCategoryLabel,
  getQuizLevelLabel,
  getQuizLevelMaxScore,
  getQuizLevelSlug,
  getQuizNextLevel,
} from "@/utils/quizHelpers";

type QuizResultsProps = {
  attempt: QuizAttemptRecord;
  progress: QuizProgressSnapshot;
};

export function QuizResults({ attempt, progress }: QuizResultsProps) {
  const config = quizLevelConfigs[attempt.level];
  const nextLevel = getQuizNextLevel(attempt.level);
  const nextLevelUnlocked = nextLevel
    ? progress.unlockedLevels.includes(nextLevel)
    : false;
  const reviewHref = `/jogar/quiz-guiado/${getQuizLevelSlug(attempt.level)}/revisao?attempt=${attempt.id}`;
  const retryHref = `/jogar/quiz-guiado/${getQuizLevelSlug(attempt.level)}/questao`;
  const nextLevelHref = nextLevel
    ? `/jogar/quiz-guiado/${getQuizLevelSlug(nextLevel)}`
    : "/jogar/quiz-guiado";
  return (
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-5xl items-center px-4 py-8 sm:px-6">
      <div className="grid w-full gap-5 lg:grid-cols-[1.18fr,0.82fr]">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-white/10 bg-[#12205b]/36 p-6 text-white shadow-[0_24px_60px_rgba(7,12,40,0.28)]"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-sm text-[#d7e5ff]">{config.icon} Quiz concluido</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {attempt.summary.accuracy}% de desempenho
          </h1>
          <p className="mt-3 text-base text-[#d7e5ff]">
            {attempt.summary.stars > 0 ? "⭐".repeat(attempt.summary.stars) : "Sem estrelas"} •{" "}
            {getQuizLevelLabel(attempt.level)}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ResultItem
              label="Pontuacao"
              value={`${attempt.summary.earnedPoints}/${getQuizLevelMaxScore(attempt.level)}`}
            />
            <ResultItem
              label="Moedas ganhas"
              value={`${attempt.summary.earnedCoins}`}
            />
            <ResultItem
              label="Acertos"
              value={`${attempt.summary.correctCount}/${attempt.summary.totalQuestions}`}
            />
            <ResultItem
              label="Erros"
              value={`${attempt.summary.incorrectCount}`}
            />
            <ResultItem
              label="Puladas"
              value={`${attempt.summary.skippedCount}`}
            />
            <ResultItem
              label="Tempo total"
              value={formatQuizDuration(attempt.summary.totalTimeInSeconds)}
            />
          </div>

          <div className="mt-5 rounded-[1.35rem] border border-white/10 bg-[#0f1742]/55 p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
              Leitura rapida
            </p>
            <div className="mt-3 space-y-2 text-sm leading-7 text-[#e6ebff]">
              <p>
                Melhor categoria:{" "}
                <span className="font-semibold text-white">
                  {attempt.summary.bestCategory
                    ? getQuizCategoryLabel(
                        attempt.summary.bestCategory as QuizCategory,
                      )
                    : "Ainda sem destaque"}
                </span>
              </p>
              <p>
                Categoria para revisar:{" "}
                <span className="font-semibold text-white">
                  {attempt.summary.categoryToReview
                    ? getQuizCategoryLabel(
                        attempt.summary.categoryToReview as QuizCategory,
                      )
                    : "Nenhuma pendencia critica"}
                </span>
              </p>
              <p>
                Media por questao:{" "}
                <span className="font-semibold text-white">
                  {attempt.summary.timePerQuestion}s
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        <motion.aside
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 rounded-[1.8rem] border border-white/10 bg-[#12205b]/36 p-5 text-white shadow-[0_20px_45px_rgba(10,12,40,0.22)]"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.05, duration: 0.35 }}
        >
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
              Conquistas desbloqueadas
            </p>
            <div className="mt-3 space-y-2">
              {attempt.achievements.length > 0 ? (
                attempt.achievements.slice(-3).map((achievement) => (
                  <div
                    className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-3"
                    key={achievement.id}
                  >
                    <p className="text-sm font-semibold text-white">
                      {achievement.icon} {achievement.label}
                    </p>
                    <p className="mt-1 text-xs leading-6 text-[#d7e5ff]">
                      {achievement.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1rem] border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-[#c8d5ff]">
                  As proximas rodadas vao destravar as primeiras conquistas.
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-[1.15rem] border border-white/10 bg-white/7 px-4 text-sm font-semibold text-white/88"
              href={reviewHref}
            >
              Revisar respostas
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-[1.15rem] border border-[#ffb327] bg-[linear-gradient(135deg,#5a39ff_0%,#8d2dff_52%,#c51bff_100%)] px-4 text-sm font-semibold text-white"
              href={retryHref}
            >
              Refazer quiz
            </Link>
            <Link
              className={`inline-flex min-h-12 items-center justify-center rounded-[1.15rem] border px-4 text-sm font-semibold ${
                nextLevelUnlocked
                  ? "border-white/10 bg-white/7 text-white/88"
                  : "pointer-events-none border-white/10 bg-white/5 text-white/35"
              }`}
              href={nextLevelHref}
            >
              {nextLevelUnlocked && nextLevel
                ? `Ir para ${getQuizLevelLabel(nextLevel)}`
                : "Proximo nivel bloqueado"}
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-[1.15rem] border border-white/10 bg-white/7 px-4 text-sm font-semibold text-white/88"
              href="/jogar/quiz-guiado"
            >
              Menu principal
            </Link>
          </div>
        </motion.aside>
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
