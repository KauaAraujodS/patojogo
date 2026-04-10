import { type QuizReviewItem } from "@/data/questions";

type QuizReviewProps = {
  items: QuizReviewItem[];
};

export function QuizReview({ items }: QuizReviewProps) {
  return (
    <section className="space-y-3 rounded-[1.8rem] border border-white/10 bg-[#12205b]/36 p-5 text-white shadow-[0_20px_45px_rgba(10,12,40,0.22)]">
      <h2 className="text-xl font-semibold">Revisao de respostas</h2>

      {items.length === 0 ? (
        <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-[#c8d5ff]">
          Nenhuma resposta registrada ainda.
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item.questionId}
            className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4"
          >
            <p className="text-sm font-semibold text-white">
              {item.isCorrect ? "Correta" : "Incorreta"} • {item.type}
            </p>
            <p className="mt-2 text-sm text-[#e7ecff]">{item.questionText}</p>
            <p className="mt-3 text-sm text-[#ffd778]">
              Sua resposta: {item.selectedAnswerLabel}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#c8d5ff]">
              {item.explanation}
            </p>
          </div>
        ))
      )}
    </section>
  );
}
