import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { type QuizAnswerValue, type QuizQuestion } from "@/data/questions";

type QuizQuestionProps = {
  coinBalance: number;
  index: number;
  question: QuizQuestion;
  selectedAnswer?: QuizAnswerValue;
  total: number;
};

export function QuizQuestion({
  coinBalance,
  index,
  question,
  selectedAnswer,
  total,
}: QuizQuestionProps) {
  const progressWidth = Math.round(((index + 1) / total) * 100);

  return (
    <section className="space-y-4 rounded-[1.8rem] border border-white/10 bg-[#12205b]/36 p-5 text-white shadow-[0_20px_45px_rgba(10,12,40,0.22)]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-[#d7e5ff]">
          Questao {index + 1}/{total}
        </p>
        <p className="text-sm font-semibold text-[#ffd778]">{coinBalance} moedas</p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#5f52ff,#c517ff)]"
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      {question.image ? (
        <div className="flex min-h-40 items-center justify-center rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.03] text-sm text-[#c8d5ff]">
          Placeholder de imagem: {question.image}
        </div>
      ) : null}

      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
          {question.type}
        </p>
        <h2 className="mt-3 text-xl font-semibold leading-8 text-white">
          {question.question}
        </h2>
      </div>

      {question.options ? (
        <div className="grid gap-3">
          {question.options.map((option, optionIndex) => {
            const isSelected = selectedAnswer === optionIndex;

            return (
              <button
                key={option}
                className={cn(
                  "rounded-[1.2rem] border px-4 py-4 text-left text-sm text-white/88 transition-colors",
                  isSelected
                    ? "border-[#ffd778] bg-white/10"
                    : "border-white/10 bg-white/[0.04]",
                )}
                type="button"
              >
                {String.fromCharCode(65 + optionIndex)}) {option}
              </button>
            );
          })}
        </div>
      ) : null}

      {question.type === "matching" && question.pairs ? (
        <div className="grid gap-2">
          {question.pairs.map((pair) => (
            <div
              key={pair.left}
              className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/84"
            >
              {pair.left} → {pair.right}
            </div>
          ))}
        </div>
      ) : null}

      {question.type === "ordering" && question.items ? (
        <div className="grid gap-2">
          {question.items.map((item, itemIndex) => (
            <div
              key={item}
              className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/84"
            >
              {itemIndex + 1}. {item}
            </div>
          ))}
        </div>
      ) : null}

      {question.type === "open-ended" ? (
        <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-white/84">
          Resposta discursiva prevista. Minimo de {question.minLength ?? 0} caracteres.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Button
          className="border-white/10 bg-white/7 text-white hover:border-white/10 hover:bg-white/12"
          size="lg"
        >
          Dica
        </Button>
        <Button
          className="border-white/10 bg-white/7 text-white hover:border-white/10 hover:bg-white/12"
          size="lg"
        >
          Pular
        </Button>
        <Button
          className="border-[#ffb327] bg-[linear-gradient(135deg,#5a39ff_0%,#8d2dff_52%,#c51bff_100%)] text-white hover:border-[#ffb327] hover:bg-[linear-gradient(135deg,#5a39ff_0%,#8d2dff_52%,#c51bff_100%)]"
          size="lg"
        >
          Confirmar
        </Button>
      </div>
    </section>
  );
}
