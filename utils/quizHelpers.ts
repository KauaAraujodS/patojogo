import {
  questionBank,
  quizLevelConfigs,
  quizLevelOrder,
  type QuizAttemptSummary,
  type QuizCategory,
  type QuizCompletedQuestion,
  type QuizLevel,
  type QuizLevelProgress,
  type QuizLevelSlug,
  type QuizProgressSnapshot,
  type QuizQuestion,
  type QuizReviewItem,
} from "@/data/questions";

export function buildEmptyLevelProgress(level: QuizLevel): QuizLevelProgress {
  return {
    averageAccuracy: 0,
    bestScore: 0,
    categoryStats: {},
    completedCount: 0,
    completedQuestions: [],
    completionPercentage: 0,
    correctCount: 0,
    incorrectCount: 0,
    lastAttemptDate: null,
    skippedCount: 0,
    totalCoins: 0,
    totalQuestions: quizLevelConfigs[level].questionCount,
    totalScore: 0,
  };
}

export function buildDefaultQuizProgress(userId: string): QuizProgressSnapshot {
  return {
    levelProgress: {
      beginner: buildEmptyLevelProgress("beginner"),
      intermediate: buildEmptyLevelProgress("intermediate"),
      advanced: buildEmptyLevelProgress("advanced"),
    },
    unlockedLevels: ["beginner"],
    userId,
  };
}

export function getQuizLevelFromSlug(
  slug: string,
): QuizLevel | null {
  const found = quizLevelOrder.find(
    (level) => quizLevelConfigs[level].slug === slug,
  );

  return found ?? null;
}

export function getQuizLevelSlug(level: QuizLevel): QuizLevelSlug {
  return quizLevelConfigs[level].slug;
}

export function getQuizLevelQuestions(level: QuizLevel) {
  return questionBank.filter((question) => question.level === level);
}

export function getQuizSeedQuestionCount(level: QuizLevel) {
  return getQuizLevelQuestions(level).length;
}

export function getQuizLevelProgress(
  progress: QuizProgressSnapshot,
  level: QuizLevel,
) {
  return progress.levelProgress[level];
}

export function isQuizLevelUnlocked(
  progress: QuizProgressSnapshot,
  level: QuizLevel,
) {
  if (level === "beginner") {
    return true;
  }

  if (progress.unlockedLevels.includes(level)) {
    return true;
  }

  const previousLevel =
    level === "intermediate" ? "beginner" : "intermediate";
  const requirement = quizLevelConfigs[level].requiredAccuracy ?? 0;

  return progress.levelProgress[previousLevel].averageAccuracy >= requirement;
}

export function getQuizLevelRequirementLabel(level: QuizLevel) {
  if (level === "beginner") {
    return "Desbloqueado";
  }

  const previousLabel =
    level === "intermediate"
      ? quizLevelConfigs.beginner.label
      : quizLevelConfigs.intermediate.label;

  return `Requer ${quizLevelConfigs[level].requiredAccuracy}% no ${previousLabel}`;
}

export function getQuizStars(accuracy: number) {
  if (accuracy >= 90) {
    return 3;
  }

  if (accuracy >= 70) {
    return 2;
  }

  if (accuracy >= 50) {
    return 1;
  }

  return 0;
}

export function formatQuizDuration(totalTimeInSeconds: number) {
  const minutes = Math.floor(totalTimeInSeconds / 60);
  const seconds = totalTimeInSeconds % 60;

  return `${minutes}min ${seconds.toString().padStart(2, "0")}s`;
}

export function buildQuizReviewItems(
  questions: QuizQuestion[],
  completedQuestions: QuizCompletedQuestion[],
): QuizReviewItem[] {
  return completedQuestions
    .map((completedQuestion) => {
      const question = questions.find(
        (item) => item.id === completedQuestion.questionId,
      );

      if (!question) {
        return null;
      }

      return {
        explanation: question.explanation,
        isCorrect: completedQuestion.isCorrect,
        questionId: question.id,
        questionText: question.question,
        selectedAnswerLabel: stringifyQuizAnswer(completedQuestion.userAnswer),
        type: question.type,
      };
    })
    .filter((item): item is QuizReviewItem => item !== null);
}

export function stringifyQuizAnswer(answer: QuizCompletedQuestion["userAnswer"]) {
  if (Array.isArray(answer)) {
    return answer.join(", ");
  }

  if (typeof answer === "boolean") {
    return answer ? "Verdadeiro" : "Falso";
  }

  if (answer === null) {
    return "Sem resposta";
  }

  return String(answer);
}

export function calculateQuizAttemptSummary(
  level: QuizLevel,
  progress: QuizLevelProgress,
): QuizAttemptSummary {
  const totalAnswered =
    progress.correctCount + progress.incorrectCount + progress.skippedCount;
  const accuracy =
    totalAnswered > 0
      ? Math.round((progress.correctCount / totalAnswered) * 100)
      : 0;

  const categoryToReview = Object.entries(progress.categoryStats).sort(
    (a, b) => a[1].accuracy - b[1].accuracy,
  )[0]?.[0] as QuizCategory | undefined;

  return {
    accuracy,
    categoryToReview: categoryToReview ?? null,
    correctCount: progress.correctCount,
    earnedCoins: progress.totalCoins,
    earnedPoints: progress.totalScore,
    incorrectCount: progress.incorrectCount,
    level,
    skippedCount: progress.skippedCount,
    stars: getQuizStars(accuracy),
    timePerQuestion:
      totalAnswered > 0
        ? Math.round(
            progress.completedQuestions.reduce(
              (accumulator, item) => accumulator + item.timeSpent,
              0,
            ) / totalAnswered,
          )
        : 0,
    totalQuestions: progress.totalQuestions,
    totalTimeInSeconds: progress.completedQuestions.reduce(
      (accumulator, item) => accumulator + item.timeSpent,
      0,
    ),
  };
}
