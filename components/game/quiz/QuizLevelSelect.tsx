"use client";

import Link from "next/link";
import { motion } from "motion/react";
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
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-5xl items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full space-y-5">
        <div className="rounded-[2rem] border border-white/10 bg-[#12205b]/40 p-6 text-white shadow-[0_24px_60px_rgba(7,12,40,0.28)] backdrop-blur">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9fb5ff]">
            Quiz guiado
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Escolha seu nivel
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d7e5ff] sm:text-base">
            Cada trilha libera a proxima conforme seu desempenho. Tudo que voce
            responde entra no seu progresso, ranking final e historico de
            revisao.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr,0.8fr]">
          <div className="grid gap-4">
            {quizLevelOrder.map((level, index) => {
              const config = quizLevelConfigs[level];
              const levelProgress = getQuizLevelProgress(progress, level);
              const unlocked = isQuizLevelUnlocked(progress, level);
              const stars = getQuizStars(levelProgress.averageAccuracy);
              const href = `/jogar/quiz-guiado/${getQuizLevelSlug(level)}`;

              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 18 }}
                  key={level}
                  transition={{ delay: index * 0.08, duration: 0.35 }}
                >
                  {unlocked ? (
                    <Link
                      className={cn(
                        "block rounded-[1.9rem] border p-5 text-white shadow-[0_24px_50px_rgba(10,14,45,0.24)] transition-transform duration-200 hover:-translate-y-1",
                        "border-white/14 bg-gradient-to-r",
                        config.buttonGradient,
                      )}
                      href={href}
                    >
                      <LevelCardBody
                        accuracy={levelProgress.averageAccuracy}
                        completionPercentage={levelProgress.completionPercentage}
                        label={config.label}
                        rewardText={config.rewardText}
                        stars={stars}
                        statusLabel={
                          levelProgress.completedCount > 0
                            ? "Desempenho salvo"
                            : "Pronto para comecar"
                        }
                      />
                    </Link>
                  ) : (
                    <div className="rounded-[1.9rem] border border-white/10 bg-white/6 p-5 text-white/90 opacity-80">
                      <LevelCardBody
                        accuracy={levelProgress.averageAccuracy}
                        completionPercentage={0}
                        label={config.label}
                        rewardText={getQuizLevelRequirementLabel(level)}
                        stars={stars}
                        statusLabel="Bloqueado"
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="space-y-4 rounded-[1.9rem] border border-white/10 bg-[#12205b]/42 p-5 text-white shadow-[0_20px_45px_rgba(10,14,45,0.18)]">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9fb5ff]">
                Seu resumo
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Progresso do participante
              </h2>
            </div>

            <div className="grid gap-3">
              <MiniStat
                label="Niveis desbloqueados"
                value={`${progress.unlockedLevels.length}/3`}
              />
              <MiniStat
                label="Conquistas"
                value={`${progress.achievements.length}`}
              />
              <MiniStat
                label="Questoes registradas"
                value={`${Object.values(progress.levelProgress).reduce((accumulator, levelProgress) => accumulator + levelProgress.completedCount, 0)}`}
              />
            </div>

            <div className="grid gap-3 pt-2">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-[1.1rem] border border-[#ffb327] bg-[linear-gradient(135deg,#5a39ff_0%,#8d2dff_52%,#c51bff_100%)] px-4 text-sm font-semibold text-white"
                href="/jogar/quiz-guiado/estatisticas"
              >
                Ver estatisticas
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-[1.1rem] border border-white/10 bg-white/7 px-4 text-sm font-semibold text-white/88"
                href="/"
              >
                Voltar ao menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LevelCardBody({
  accuracy,
  completionPercentage,
  label,
  rewardText,
  stars,
  statusLabel,
}: {
  accuracy: number;
  completionPercentage: number;
  label: string;
  rewardText: string;
  stars: number;
  statusLabel: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr,auto] sm:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/70">
          {statusLabel}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {label}
        </h2>
        <p className="mt-2 text-sm leading-7 text-white/84">{rewardText}</p>
      </div>

      <div className="space-y-3 rounded-[1.4rem] bg-black/12 px-4 py-3 sm:min-w-[12rem]">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-white/72">Precisao</span>
          <span className="font-semibold text-white">{accuracy}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/14">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#ffd96a,#fff1a8)]"
            style={{ width: `${Math.min(Math.max(completionPercentage, 6), 100)}%` }}
          />
        </div>
        <p className="text-xs text-white/74">
          {stars > 0 ? "★".repeat(stars) : "Sem estrelas ainda"}
        </p>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.15rem] border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#9fb5ff]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
