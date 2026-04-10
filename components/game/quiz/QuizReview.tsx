"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import {
  type QuizAttemptRecord,
  type QuizReviewFilter,
} from "@/data/questions";
import { cn } from "@/lib/cn";

type QuizReviewProps = {
  attempt: QuizAttemptRecord;
  backHref: string;
  defaultFilter?: QuizReviewFilter;
};

const filters: QuizReviewFilter[] = ["all", "correct", "incorrect", "skipped"];

export function QuizReview({
  attempt,
  backHref,
  defaultFilter = "all",
}: QuizReviewProps) {
  const [activeFilter, setActiveFilter] = useState<QuizReviewFilter>(defaultFilter);
  const filteredItems = attempt.reviewItems.filter((item, index) => {
    const answer = attempt.answers[index];

    if (activeFilter === "all") {
      return true;
    }

    if (activeFilter === "correct") {
      return item.isCorrect;
    }

    if (activeFilter === "incorrect") {
      return !item.isCorrect && !answer?.skipped;
    }

    return answer?.skipped;
  });

  return (
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-5xl items-center px-4 py-8 sm:px-6">
      <div className="w-full space-y-5 rounded-[2rem] border border-white/10 bg-[#12205b]/36 p-5 text-white shadow-[0_24px_60px_rgba(7,12,40,0.28)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9fb5ff]">
              Revisao
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Revise cada resposta
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/8 px-4 text-sm font-medium text-white/88 transition-colors hover:bg-white/12"
              href={backHref}
            >
              Voltar
            </Link>
            <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/82">
              {attempt.reviewItems.length} itens
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                activeFilter === filter
                  ? "border-[#ffb327] bg-[linear-gradient(135deg,#5a39ff_0%,#8d2dff_52%,#c51bff_100%)] text-white"
                  : "border-white/10 bg-white/[0.04] text-white/82 hover:bg-white/[0.08]",
              )}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {getFilterLabel(filter)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-[#c8d5ff]">
              Nenhum item encontrado para esse filtro.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const answer = attempt.answers.find(
                (currentAnswer) => currentAnswer.questionId === item.questionId,
              );
              const isSkipped = answer?.skipped ?? false;

              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4"
                  initial={{ opacity: 0, y: 12 }}
                  key={item.questionId}
                  transition={{ delay: index * 0.04, duration: 0.22 }}
                >
                  <p className="text-sm font-semibold text-white">
                    {isSkipped
                      ? "⏭ Pulada"
                      : item.isCorrect
                        ? "✅ Correta"
                        : "❌ Incorreta"}{" "}
                    • {item.type}
                  </p>
                  <p className="mt-2 text-sm text-[#e7ecff]">{item.questionText}</p>
                  <p className="mt-3 text-sm text-[#ffd778]">
                    Sua resposta: {item.selectedAnswerLabel}
                  </p>
                  {item.correctAnswerLabel ? (
                    <p className="mt-2 text-sm text-[#bcd0ff]">
                      Resposta correta: {item.correctAnswerLabel}
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm leading-7 text-[#c8d5ff]">
                    {item.explanation}
                  </p>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

function getFilterLabel(filter: QuizReviewFilter) {
  switch (filter) {
    case "all":
      return "Todas";
    case "correct":
      return "Corretas";
    case "incorrect":
      return "Erradas";
    case "skipped":
      return "Puladas";
    default:
      return filter;
  }
}
