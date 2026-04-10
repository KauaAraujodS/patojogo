"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  quizLevelConfigs,
  type QuizAnswerValue,
  type QuizQuestion,
} from "@/data/questions";
import {
  getHintCost,
  getQuizCategoryLabel,
  getQuizQuestionTypeLabel,
} from "@/utils/quizHelpers";

type QuizQuestionProps = {
  canRevealHint: boolean;
  canConfirm: boolean;
  coinBalance: number;
  hintsUsed: number;
  index: number;
  onConfirm: () => void;
  onRevealHint: () => void;
  onSelectAnswer: (value: QuizAnswerValue) => void;
  onSkip: () => void;
  question: QuizQuestion;
  remainingSkips: number;
  revealedHints: string[];
  selectedAnswer: QuizAnswerValue;
  total: number;
};

export function QuizQuestion({
  canRevealHint,
  canConfirm,
  coinBalance,
  hintsUsed,
  index,
  onConfirm,
  onRevealHint,
  onSelectAnswer,
  onSkip,
  question,
  remainingSkips,
  revealedHints,
  selectedAnswer,
  total,
}: QuizQuestionProps) {
  const progressWidth = Math.round(((index + 1) / total) * 100);
  const config = quizLevelConfigs[question.level];
  const mediaSource = question.image ?? question.illustration ?? null;

  return (
    <motion.section
      animate={{ opacity: 1, x: 0 }}
      className="grid gap-4 lg:grid-cols-[1fr,17rem]"
      exit={{ opacity: 0, x: -18 }}
      initial={{ opacity: 0, x: 18 }}
      key={question.id}
      transition={{ duration: 0.24 }}
    >
      <div className="space-y-4 rounded-[1.8rem] border border-white/10 bg-[#12205b]/36 p-5 text-white shadow-[0_20px_45px_rgba(10,12,40,0.22)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[#d7e5ff]">
            Questao {index + 1}/{total}
          </p>
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-semibold text-[#ffd778]">
              {coinBalance} moedas
            </div>
            <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs text-white/78">
              {remainingSkips} pulos
            </div>
          </div>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            animate={{ width: `${progressWidth}%` }}
            className="h-full rounded-full bg-[linear-gradient(90deg,#5f52ff,#c517ff)]"
            transition={{ duration: 0.25 }}
          />
        </div>

        {mediaSource ? (
          <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#0f1742]/62">
            <Image
              alt={question.question}
              className="h-[13.5rem] w-full object-cover"
              height={540}
              src={mediaSource}
              unoptimized
              width={960}
            />
          </div>
        ) : null}

        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>{getQuizQuestionTypeLabel(question.type)}</Badge>
            <Badge>{getQuizCategoryLabel(question.category)}</Badge>
            <Badge>{question.points} pts</Badge>
          </div>
          <h2 className="mt-4 text-xl font-semibold leading-8 text-white sm:text-[1.65rem]">
            {question.question}
          </h2>
        </div>

        <div className="space-y-3">
          {renderQuestionInput({
            onSelectAnswer,
            question,
            selectedAnswer,
          })}
        </div>

        {revealedHints.length > 0 ? (
          <div className="space-y-2 rounded-[1.25rem] border border-[#ffd261]/25 bg-[#241a50]/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ffd778]">
              Dicas abertas
            </p>
            {revealedHints.map((hint, hintIndex) => (
              <div
                className="rounded-[1rem] border border-white/8 bg-white/[0.04] px-3 py-3 text-sm text-[#f2f5ff]"
                key={`${question.id}-hint-${hintIndex}`}
              >
                <span className="mr-2 font-semibold text-[#ffd778]">
                  {hintIndex + 1}.
                </span>
                {hint}
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-3">
          <Button
            className="border-white/10 bg-white/7 text-white hover:border-white/10 hover:bg-white/12"
            disabled={!canRevealHint}
            onClick={onRevealHint}
            size="lg"
          >
            {question.hints && hintsUsed < question.hints.length
              ? `Dica (-${getHintCost(hintsUsed)} moeda${getHintCost(hintsUsed) > 1 ? "s" : ""})`
              : "Sem dicas"}
          </Button>
          <Button
            className="border-white/10 bg-white/7 text-white hover:border-white/10 hover:bg-white/12"
            disabled={remainingSkips === 0}
            onClick={onSkip}
            size="lg"
          >
            Pular
          </Button>
          <Button
            className={cn(
              "border-[#ffb327] text-white hover:border-[#ffb327]",
              canConfirm
                ? `bg-gradient-to-r ${config.buttonGradient}`
                : "bg-white/8 opacity-55",
            )}
            disabled={!canConfirm}
            onClick={onConfirm}
            size="lg"
          >
            Confirmar
          </Button>
        </div>
      </div>

      <aside className="space-y-4 rounded-[1.8rem] border border-white/10 bg-[#12205b]/36 p-5 text-white shadow-[0_20px_45px_rgba(10,12,40,0.22)]">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
            Nivel
          </p>
          <p className="mt-2 text-xl font-semibold text-white">{config.label}</p>
        </div>

        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
            Recompensa
          </p>
          <p className="mt-2 text-sm text-[#d7e5ff]">
            {question.points} pontos e {question.coinReward} moedas se acertar.
          </p>
        </div>

        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
            Regras rapidas
          </p>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-[#d7e5ff]">
            <li>Dicas reduzem pontos pela metade.</li>
            <li>Voce pode pular ate 5 questoes por rodada.</li>
            <li>Todo acerto soma para o ranking final.</li>
          </ul>
        </div>
      </aside>
    </motion.section>
  );
}

function renderQuestionInput({
  onSelectAnswer,
  question,
  selectedAnswer,
}: {
  onSelectAnswer: (value: QuizAnswerValue) => void;
  question: QuizQuestion;
  selectedAnswer: QuizAnswerValue;
}) {
  if (
    question.type === "multiple-choice" ||
    question.type === "image-identification"
  ) {
    return (
      <div className="grid gap-3">
        {question.options?.map((option, optionIndex) => {
          const isSelected = selectedAnswer === optionIndex;

          return (
            <button
              className={cn(
                "rounded-[1.2rem] border px-4 py-4 text-left text-sm text-white/88 transition-all",
                isSelected
                  ? "border-[#ffd778] bg-white/10 shadow-[0_0_0_1px_rgba(255,215,120,0.24)]"
                  : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
              )}
              key={option}
              onClick={() => onSelectAnswer(optionIndex)}
              type="button"
            >
              <span className="mr-2 font-semibold text-[#ffd778]">
                {String.fromCharCode(65 + optionIndex)})
              </span>
              {option}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "true-false") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {[true, false].map((option) => {
          const isSelected = selectedAnswer === option;

          return (
            <button
              className={cn(
                "rounded-[1.2rem] border px-4 py-5 text-left text-base font-semibold text-white transition-all",
                isSelected
                  ? "border-[#ffd778] bg-white/10 shadow-[0_0_0_1px_rgba(255,215,120,0.24)]"
                  : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
              )}
              key={String(option)}
              onClick={() => onSelectAnswer(option)}
              type="button"
            >
              {option ? "Verdadeiro" : "Falso"}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "matching" && question.pairs) {
    const pairs = question.pairs;
    const currentSelections = Array.isArray(selectedAnswer)
      ? (selectedAnswer as number[])
      : Array.from({ length: pairs.length }, () => -1);

    return (
      <div className="space-y-3">
        {pairs.map((pair, pairIndex) => (
          <div
            className="grid gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-[1fr,0.95fr]"
            key={pair.left}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#9fb5ff]">
                Item {pairIndex + 1}
              </p>
              <p className="mt-2 text-sm font-semibold text-white">{pair.left}</p>
            </div>
            <label className="text-sm text-[#d7e5ff]">
              <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#9fb5ff]">
                Causa
              </span>
              <select
                className="w-full rounded-[1rem] border border-white/10 bg-[#0d1541] px-3 py-3 text-white outline-none"
                onChange={(event) => {
                  const nextAnswer = [...currentSelections];
                  nextAnswer[pairIndex] = Number(event.target.value);
                  onSelectAnswer(nextAnswer);
                }}
                value={currentSelections[pairIndex] ?? -1}
              >
                <option value={-1}>Selecione</option>
                {pairs.map((option, optionIndex) => (
                  <option key={`${pair.left}-${option.right}`} value={optionIndex}>
                    {option.right}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
    );
  }

  if (question.type === "ordering" && question.items) {
    const orderedIndexes = Array.isArray(selectedAnswer)
      ? (selectedAnswer as number[])
      : question.items.map((_, itemIndex) => itemIndex);

    return (
      <div className="space-y-3">
        {orderedIndexes.map((itemIndex, position) => (
          <div
            className="grid grid-cols-[auto,1fr,auto] items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4"
            key={`${question.id}-${itemIndex}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-sm font-semibold text-[#ffd778]">
              {position + 1}
            </div>
            <p className="text-sm text-white/88">{question.items?.[itemIndex]}</p>
            <div className="flex gap-2">
              <ReorderButton
                direction="up"
                disabled={position === 0}
                onClick={() => {
                  const nextOrder = [...orderedIndexes];
                  [nextOrder[position - 1], nextOrder[position]] = [
                    nextOrder[position],
                    nextOrder[position - 1],
                  ];
                  onSelectAnswer(nextOrder);
                }}
              />
              <ReorderButton
                direction="down"
                disabled={position === orderedIndexes.length - 1}
                onClick={() => {
                  const nextOrder = [...orderedIndexes];
                  [nextOrder[position + 1], nextOrder[position]] = [
                    nextOrder[position],
                    nextOrder[position + 1],
                  ];
                  onSelectAnswer(nextOrder);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <label className="block">
      <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
        Resposta discursiva
      </span>
      <textarea
        className="min-h-44 w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-white/35"
        onChange={(event) => onSelectAnswer(event.target.value)}
        placeholder="Descreva sua analise tecnica aqui..."
        value={typeof selectedAnswer === "string" ? selectedAnswer : ""}
      />
      <p className="mt-2 text-xs text-[#c8d5ff]">
        Minimo de {question.minLength ?? 0} caracteres para validar a resposta.
      </p>
    </label>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs text-white/84">
      {children}
    </span>
  );
}

function ReorderButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "up" | "down";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/78",
        !disabled && "hover:bg-white/12",
        disabled && "opacity-35",
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {direction === "up" ? "↑" : "↓"}
    </button>
  );
}
