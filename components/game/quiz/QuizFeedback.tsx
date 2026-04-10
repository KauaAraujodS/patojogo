import { type QuizQuestion } from "@/data/questions";

type QuizFeedbackProps = {
  earnedCoins: number;
  earnedPoints: number;
  isCorrect: boolean;
  question: QuizQuestion;
};

export function QuizFeedback({
  earnedCoins,
  earnedPoints,
  isCorrect,
  question,
}: QuizFeedbackProps) {
  return (
    <section className="rounded-[1.8rem] border border-white/10 bg-[#12205b]/36 p-5 text-white shadow-[0_20px_45px_rgba(10,12,40,0.22)]">
      <h2 className="text-xl font-semibold">
        {isCorrect
          ? `Correto! +${earnedPoints} pontos +${earnedCoins} moedas`
          : "Resposta registrada"}
      </h2>
      <p className="mt-4 text-sm leading-7 text-[#d7e5ff]">{question.explanation}</p>
    </section>
  );
}
