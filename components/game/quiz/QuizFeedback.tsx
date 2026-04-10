"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { type QuizFeedbackState } from "@/data/questions";
import { cn } from "@/lib/cn";

type QuizFeedbackProps = {
  feedback: QuizFeedbackState;
  isLastQuestion: boolean;
  onNext: () => void;
};

export function QuizFeedback({
  feedback,
  isLastQuestion,
  onNext,
}: QuizFeedbackProps) {
  const title =
    feedback.mode === "skipped"
      ? "Questao pulada"
      : feedback.isCorrect
        ? `Correto! +${feedback.earnedPoints} pontos ${feedback.earnedCoins >= 0 ? `+${feedback.earnedCoins}` : feedback.earnedCoins} moedas`
        : "Resposta incorreta";

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-[1.8rem] border p-5 text-white shadow-[0_20px_45px_rgba(10,12,40,0.22)]",
        feedback.isCorrect
          ? "border-[#28d777]/26 bg-[linear-gradient(180deg,rgba(22,121,80,0.24),rgba(18,32,91,0.4))]"
          : "border-white/10 bg-[#12205b]/36",
      )}
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.22 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#d7e5ff]">
            {feedback.mode === "skipped"
              ? "Sem pontuacao nessa rodada"
              : feedback.isCorrect
                ? "Resposta validada"
                : "Veja a explicacao tecnica"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
        </div>

        {feedback.isCorrect && feedback.question.difficulty >= 4 ? (
          <div className="flex items-center gap-1.5 text-xl">
            <span>🎉</span>
            <span>🏆</span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr,0.85fr]">
        <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
            Explicacao
          </p>
          <p className="mt-3 text-sm leading-7 text-[#e8edff]">
            {feedback.question.explanation}
          </p>
        </div>

        <div className="space-y-3 rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
          <FeedbackLine label="Sua resposta" value={feedback.selectedAnswerLabel} />
          {feedback.correctAnswerLabel ? (
            <FeedbackLine
              label="Resposta correta"
              value={feedback.correctAnswerLabel}
            />
          ) : null}
          {feedback.question.references?.length ? (
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
                Referencias
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-[#d7e5ff]">
                {feedback.question.references.map((reference) => (
                  <li key={reference}>• {reference}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <Button
          className="w-full border-[#ffb327] bg-[linear-gradient(135deg,#5a39ff_0%,#8d2dff_52%,#c51bff_100%)] text-white hover:border-[#ffb327]"
          onClick={onNext}
          size="lg"
        >
          {isLastQuestion ? "Ver resultado final" : "Proxima questao"}
        </Button>
      </div>
    </motion.section>
  );
}

function FeedbackLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
        {label}
      </p>
      <p className="mt-2 text-sm text-[#ecf0ff]">{value}</p>
    </div>
  );
}
