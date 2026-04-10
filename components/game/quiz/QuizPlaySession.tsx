"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import {
  type QuizAnswerValue,
  type QuizCompletedQuestion,
  type QuizFeedbackState,
  type QuizLevel,
  type QuizProgressSnapshot,
  type QuizQuestion as QuizQuestionData,
} from "@/data/questions";
import { QuizFeedback } from "@/components/game/quiz/QuizFeedback";
import { QuizQuestion } from "@/components/game/quiz/QuizQuestion";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import {
  queueQuizSync,
  storeLastQuizAttempt,
  syncQuizProgressToSupabase,
} from "@/lib/quiz/client";
import {
  buildAttemptRecord,
  buildQuizAchievements,
  calculateQuestionRewards,
  evaluateQuizAnswer,
  formatQuizAnswerForQuestion,
  getCanonicalCorrectAnswer,
  getHintCost,
  getQuizLevelQuestions,
  getQuizLevelSlug,
  mergeQuizProgressSnapshot,
  shuffleQuizQuestions,
  stringifyQuizAnswer,
} from "@/utils/quizHelpers";

type QuizPlaySessionProps = {
  initialCoins: number;
  initialProgress: QuizProgressSnapshot;
  level: QuizLevel;
  userId: string;
};

const MAX_SKIPS = 5;

export function QuizPlaySession({
  initialCoins,
  initialProgress,
  level,
  userId,
}: QuizPlaySessionProps) {
  const router = useRouter();
  const { persistProgress, progress } = useQuizProgress(initialProgress);
  const [questions] = useState(() =>
    shuffleQuizQuestions(getQuizLevelQuestions(level)),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizAnswerValue>(
    buildInitialAnswer(questions[0]),
  );
  const [revealedHints, setRevealedHints] = useState<string[]>([]);
  const [answers, setAnswers] = useState<QuizCompletedQuestion[]>([]);
  const [coinBalance, setCoinBalance] = useState(initialCoins);
  const [skipCount, setSkipCount] = useState(0);
  const [feedback, setFeedback] = useState<QuizFeedbackState | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const questionStartedAtRef = useRef(0);

  const currentQuestion = questions[currentIndex];
  const remainingSkips = MAX_SKIPS - skipCount;
  const shouldConfirmExit =
    answers.length > 0 ||
    feedback !== null ||
    revealedHints.length > 0 ||
    skipCount > 0;

  useEffect(() => {
    if (questionStartedAtRef.current === 0) {
      questionStartedAtRef.current = Date.now();
    }
  }, []);

  useEffect(() => {
    const nextQuestion = questions[currentIndex + 1];
    const mediaSource = nextQuestion?.image ?? nextQuestion?.illustration;

    if (!mediaSource) {
      return;
    }

    const preloadImage = new window.Image();
    preloadImage.src = mediaSource;
  }, [currentIndex, questions]);

  function resetForNextQuestion(nextQuestionIndex: number) {
    questionStartedAtRef.current = Date.now();
    setCurrentIndex(nextQuestionIndex);
    setSelectedAnswer(buildInitialAnswer(questions[nextQuestionIndex]));
    setRevealedHints([]);
    setFeedback(null);
  }

  function handleSelectAnswer(nextAnswer: QuizAnswerValue) {
    setSelectedAnswer(nextAnswer);
  }

  function handleRevealHint() {
    if (!currentQuestion.hints || revealedHints.length >= currentQuestion.hints.length) {
      return;
    }

    const nextHintIndex = revealedHints.length;
    const nextHint = currentQuestion.hints[nextHintIndex];
    const hintCost = getHintCost(nextHintIndex);

    if (coinBalance < hintCost) {
      return;
    }

    setCoinBalance((currentCoins) => currentCoins - hintCost);
    setRevealedHints((currentHints) => [...currentHints, nextHint]);
  }

  function handleSkip() {
    if (remainingSkips === 0) {
      return;
    }

    const completedAt = new Date().toISOString();
    const timeSpent = Math.max(
      1,
      Math.round((Date.now() - questionStartedAtRef.current) / 1000),
    );
    const hintCostSpent = revealedHints.reduce(
      (accumulator, _, hintIndex) => accumulator + getHintCost(hintIndex),
      0,
    );
    const skippedAnswer = {
      attemptDate: completedAt,
      earnedCoins: -hintCostSpent,
      earnedPoints: 0,
      hintsUsed: revealedHints.length,
      isCorrect: false,
      questionCategory: currentQuestion.category,
      questionId: currentQuestion.id,
      questionType: currentQuestion.type,
      skipped: true,
      timeSpent,
      userAnswer: null,
    };

    setSkipCount((currentCount) => currentCount + 1);
    setAnswers((currentAnswers) => [...currentAnswers, skippedAnswer]);
    setFeedback({
      correctAnswerLabel: formatQuizAnswerForQuestion(
        currentQuestion,
        getCanonicalCorrectAnswer(currentQuestion),
      ),
      earnedCoins: skippedAnswer.earnedCoins,
      earnedPoints: 0,
      isCorrect: false,
      mode: "skipped",
      question: currentQuestion,
      selectedAnswerLabel: "Questao pulada",
    });
  }

  function handleConfirm() {
    if (!isAnswerReady(currentQuestion, selectedAnswer)) {
      return;
    }

    const completedAt = new Date().toISOString();
    const timeSpent = Math.max(
      1,
      Math.round((Date.now() - questionStartedAtRef.current) / 1000),
    );
    const isCorrect = evaluateQuizAnswer(currentQuestion, selectedAnswer);
    const rewards = calculateQuestionRewards(
      currentQuestion,
      isCorrect,
      revealedHints.length,
    );
    const hintCostSpent = revealedHints.reduce(
      (accumulator, _, hintIndex) => accumulator + getHintCost(hintIndex),
      0,
    );
    const earnedCoins = rewards.earnedCoins - hintCostSpent;
    const completedAnswer = {
      attemptDate: completedAt,
      earnedCoins,
      earnedPoints: rewards.earnedPoints,
      hintsUsed: revealedHints.length,
      isCorrect,
      questionCategory: currentQuestion.category,
      questionId: currentQuestion.id,
      questionType: currentQuestion.type,
      skipped: false,
      timeSpent,
      userAnswer: selectedAnswer,
    };

    setAnswers((currentAnswers) => [...currentAnswers, completedAnswer]);
    setCoinBalance((currentCoins) => currentCoins + rewards.earnedCoins);
    setFeedback({
      correctAnswerLabel: formatQuizAnswerForQuestion(
        currentQuestion,
        getCanonicalCorrectAnswer(currentQuestion),
      ),
      earnedCoins,
      earnedPoints: rewards.earnedPoints,
      isCorrect,
      mode: isCorrect ? "correct" : "incorrect",
      question: currentQuestion,
      selectedAnswerLabel: formatQuizAnswerForQuestion(
        currentQuestion,
        selectedAnswer,
      ),
    });
  }

  async function handleAdvance() {
    if (!feedback) {
      return;
    }

    const nextAnswerList = answers;
    const isLastQuestion = currentIndex === questions.length - 1;

    if (!isLastQuestion) {
      resetForNextQuestion(currentIndex + 1);
      return;
    }

    setIsFinishing(true);

    const attemptId = crypto.randomUUID();
    const mergedProgress = mergeQuizProgressSnapshot(progress, level, nextAnswerList);
    const draftAttempt = buildAttemptRecord(
      attemptId,
      level,
      nextAnswerList,
      mergedProgress.achievements,
    );
    const nextAchievements = buildQuizAchievements(
      level,
      draftAttempt.summary,
      nextAnswerList,
      progress.achievements,
    );
    const finalProgress: QuizProgressSnapshot = {
      ...mergedProgress,
      achievements: nextAchievements,
    };
    const attempt = buildAttemptRecord(
      attemptId,
      level,
      nextAnswerList,
      nextAchievements,
    );

    persistProgress(finalProgress);
    storeLastQuizAttempt(attempt, userId);

    try {
      await syncQuizProgressToSupabase({
        achievements: nextAchievements,
        attempt,
        progress: finalProgress,
        userId,
      });
    } catch {
      queueQuizSync({
        achievements: nextAchievements,
        attempt,
        progress: finalProgress,
        userId,
      });
    }

    startTransition(() => {
      router.replace(
        `/jogar/quiz-guiado/${getQuizLevelSlug(level)}/resultado?attempt=${attempt.id}`,
      );
    });
  }

  function handleExitQuiz() {
    if (
      shouldConfirmExit &&
      !window.confirm(
        "Se voltar agora, a rodada atual sera perdida. Deseja sair do quiz?",
      )
    ) {
      return;
    }

    router.push(`/jogar/quiz-guiado/${getQuizLevelSlug(level)}`);
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-6xl items-center px-4 py-8 sm:px-6">
      <div className="w-full space-y-4">
        <div className="rounded-[1.6rem] border border-white/10 bg-[#12205b]/36 px-5 py-4 text-white shadow-[0_20px_45px_rgba(10,12,40,0.22)]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
            Rodada em andamento
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {level === "beginner"
                  ? "Iniciante"
                  : level === "intermediate"
                    ? "Intermediario"
                    : "Avancado"}
              </h1>
              <p className="mt-1 text-sm text-[#d7e5ff]">
                Questao {currentIndex + 1} de {questions.length}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-white/88 transition-colors hover:bg-white/12"
                onClick={handleExitQuiz}
                type="button"
              >
                Voltar
              </button>
              <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/82">
                {isFinishing ? "Fechando rodada..." : "Tudo salvo nessa sessao"}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {feedback ? (
            <QuizFeedback
              feedback={feedback}
              isLastQuestion={currentIndex === questions.length - 1}
              key={`feedback-${currentQuestion.id}`}
              onNext={handleAdvance}
            />
          ) : (
            <QuizQuestion
              canRevealHint={
                Boolean(currentQuestion.hints) &&
                revealedHints.length < (currentQuestion.hints?.length ?? 0) &&
                coinBalance >= getHintCost(revealedHints.length)
              }
              canConfirm={isAnswerReady(currentQuestion, selectedAnswer)}
              coinBalance={coinBalance}
              hintsUsed={revealedHints.length}
              index={currentIndex}
              key={`question-${currentQuestion.id}`}
              onConfirm={handleConfirm}
              onRevealHint={handleRevealHint}
              onSelectAnswer={handleSelectAnswer}
              onSkip={handleSkip}
              question={currentQuestion}
              remainingSkips={remainingSkips}
              revealedHints={revealedHints}
              selectedAnswer={selectedAnswer}
              total={questions.length}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function buildInitialAnswer(question: QuizQuestionData | undefined) {
  if (!question) {
    return null;
  }

  if (question.type === "matching") {
    return Array.from({ length: question.pairs?.length ?? 0 }, () => -1);
  }

  if (question.type === "ordering" && question.items) {
    return shuffleQuizQuestions(question.items.map((_, index) => index));
  }

  if (question.type === "open-ended") {
    return "";
  }

  return null;
}

function isAnswerReady(question: QuizQuestionData, answer: QuizAnswerValue) {
  if (question.type === "multiple-choice" || question.type === "image-identification") {
    return typeof answer === "number";
  }

  if (question.type === "true-false") {
    return typeof answer === "boolean";
  }

  if (question.type === "matching") {
    return Array.isArray(answer) && answer.every((value) => typeof value === "number" && value >= 0);
  }

  if (question.type === "ordering") {
    return Array.isArray(answer) && answer.length === (question.items?.length ?? 0);
  }

  return typeof answer === "string" && answer.trim().length > 0;
}
