import {
  questionBank,
  quizLevelConfigs,
  quizLevelOrder,
  type QuizAchievement,
  type QuizAnswerValue,
  type QuizAttemptRecord,
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
    achievements: [],
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

export function getQuizLevelLabel(level: QuizLevel) {
  return quizLevelConfigs[level].label;
}

export function getQuizNextLevel(level: QuizLevel) {
  const currentIndex = quizLevelOrder.indexOf(level);

  if (currentIndex === -1 || currentIndex === quizLevelOrder.length - 1) {
    return null;
  }

  return quizLevelOrder[currentIndex + 1];
}

export function getQuizLevelQuestions(level: QuizLevel) {
  return questionBank.filter((question) => question.level === level);
}

export function getQuizSeedQuestionCount(level: QuizLevel) {
  return getQuizLevelQuestions(level).length;
}

export function getQuizLevelMaxScore(level: QuizLevel) {
  return getQuizLevelQuestions(level).reduce(
    (accumulator, question) => accumulator + question.points,
    0,
  );
}

export function getQuizLevelMaxCoins(level: QuizLevel) {
  return getQuizLevelQuestions(level).reduce(
    (accumulator, question) => accumulator + question.coinReward,
    0,
  );
}

export function getQuizQuestionTypeLabel(type: QuizQuestion["type"]) {
  switch (type) {
    case "multiple-choice":
      return "Multipla escolha";
    case "image-identification":
      return "Identificacao visual";
    case "true-false":
      return "Verdadeiro ou falso";
    case "matching":
      return "Associacao";
    case "ordering":
      return "Ordenacao";
    case "open-ended":
      return "Discursiva";
    default:
      return type;
  }
}

export function getQuizCategoryLabel(category: QuizCategory) {
  switch (category) {
    case "fissuras":
      return "Fissuras";
    case "corrosao":
      return "Corrosao";
    case "infiltracao":
      return "Infiltracao";
    case "descolamento":
      return "Descolamento";
    case "outros":
      return "Outros";
    default:
      return category;
  }
}

export function shuffleQuizQuestions<T>(items: T[]) {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const temporary = nextItems[index];

    nextItems[index] = nextItems[swapIndex];
    nextItems[swapIndex] = temporary;
  }

  return nextItems;
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
  const items: Array<QuizReviewItem | null> = completedQuestions
    .map((completedQuestion) => {
      const question = questions.find(
        (item) => item.id === completedQuestion.questionId,
      );

      if (!question) {
        return null;
      }

      return {
        correctAnswerLabel: formatQuizAnswerForQuestion(
          question,
          getCanonicalCorrectAnswer(question),
        ),
        explanation: question.explanation,
        isCorrect: completedQuestion.isCorrect,
        questionId: question.id,
        questionText: question.question,
        selectedAnswerLabel: formatQuizAnswerForQuestion(
          question,
          completedQuestion.userAnswer,
        ),
        type: question.type,
      };
    });

  return items.filter((item): item is QuizReviewItem => item !== null);
}

function getQuizOptionLetter(index: number) {
  return String.fromCharCode(65 + index);
}

function getOpenEndedExpectedAnswer(question: QuizQuestion) {
  const expectedTopics = question.keywords?.length
    ? `Resposta esperada: mencionar ${question.keywords.join(", ")}`
    : "Resposta esperada: analise tecnica coerente com o enunciado";
  const minLengthLabel = question.minLength
    ? ` com pelo menos ${question.minLength} caracteres`
    : "";

  return `${expectedTopics}${minLengthLabel}.`;
}

export function formatQuizAnswerForQuestion(
  question: QuizQuestion,
  answer: QuizAnswerValue,
) {
  if (answer === null) {
    return "Sem resposta";
  }

  if (
    question.type === "multiple-choice" ||
    question.type === "image-identification"
  ) {
    if (typeof answer === "number" && question.options?.[answer]) {
      return `${getQuizOptionLetter(answer)}) ${question.options[answer]}`;
    }

    return stringifyQuizAnswer(answer);
  }

  if (question.type === "true-false") {
    return typeof answer === "boolean"
      ? answer
        ? "Verdadeiro"
        : "Falso"
      : stringifyQuizAnswer(answer);
  }

  if (question.type === "matching" && question.pairs) {
    const mappedPairs =
      Array.isArray(answer) && answer.length > 0 && Array.isArray(answer[0])
        ? (answer as Array<[number, number]>)
        : Array.isArray(answer)
          ? (answer as number[]).map(
              (rightIndex, leftIndex) => [leftIndex, rightIndex] as [number, number],
            )
          : [];

    if (mappedPairs.length === 0) {
      return "Sem associacoes";
    }

    return mappedPairs
      .map(([leftIndex, rightIndex]) => {
        const leftLabel =
          question.pairs?.[leftIndex]?.left ?? `Item ${leftIndex + 1}`;
        const rightLabel =
          question.pairs?.[rightIndex]?.right ?? `Opcao ${rightIndex + 1}`;

        return `${leftLabel} → ${rightLabel}`;
      })
      .join(" • ");
  }

  if (question.type === "ordering" && question.items) {
    if (!Array.isArray(answer)) {
      return stringifyQuizAnswer(answer);
    }

    return answer
      .map((itemIndex, index) => {
        const itemLabel =
          typeof itemIndex === "number"
            ? question.items?.[itemIndex] ?? `Item ${itemIndex + 1}`
            : String(itemIndex);

        return `${index + 1}. ${itemLabel}`;
      })
      .join(" • ");
  }

  if (question.type === "open-ended") {
    if (typeof answer === "string" && answer.trim().length > 0) {
      return answer.trim();
    }

    return getOpenEndedExpectedAnswer(question);
  }

  return stringifyQuizAnswer(answer);
}

export function stringifyQuizAnswer(answer: QuizCompletedQuestion["userAnswer"]) {
  if (
    Array.isArray(answer) &&
    answer.length > 0 &&
    Array.isArray(answer[0])
  ) {
    return (answer as Array<[number, number]>)
      .map(([left, right]) => `${left + 1}→${right + 1}`)
      .join(" • ");
  }

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

export function getCanonicalCorrectAnswer(question: QuizQuestion): QuizAnswerValue {
  if (question.type === "matching" && question.correctPairs) {
    return question.correctPairs;
  }

  if (question.type === "ordering" && question.correctOrder) {
    return question.correctOrder;
  }

  return question.correctAnswer ?? null;
}

export function evaluateQuizAnswer(
  question: QuizQuestion,
  answer: QuizAnswerValue,
) {
  if (answer === null) {
    return false;
  }

  if (question.type === "open-ended") {
    if (typeof answer !== "string") {
      return false;
    }

    const normalized = answer.trim().toLowerCase();

    if (normalized.length < (question.minLength ?? 0)) {
      return false;
    }

    const keywords = question.keywords ?? [];

    if (keywords.length === 0) {
      return normalized.length > 0;
    }

    const matchedKeywords = keywords.filter((keyword) =>
      normalized.includes(keyword.toLowerCase()),
    );

    return matchedKeywords.length >= Math.ceil(keywords.length / 2);
  }

  if (question.type === "matching") {
    if (!Array.isArray(answer) || !question.correctPairs) {
      return false;
    }

    const normalizedAnswer = normalizeMatchingAnswer(
      answer as Array<[number, number]> | number[],
    );
    const normalizedExpected = normalizeMatchingAnswer(question.correctPairs);

    return JSON.stringify(normalizedAnswer) === JSON.stringify(normalizedExpected);
  }

  if (question.type === "ordering") {
    if (!Array.isArray(answer) || !question.correctOrder) {
      return false;
    }

    return JSON.stringify(answer) === JSON.stringify(question.correctOrder);
  }

  return answer === question.correctAnswer;
}

function normalizeMatchingAnswer(answer: Array<[number, number]> | number[]) {
  if (answer.length === 0) {
    return [];
  }

  if (Array.isArray(answer[0])) {
    return (answer as Array<[number, number]>)
      .map(([left, right]) => `${left}:${right}`)
      .sort();
  }

  return (answer as number[]).map((value, index) => `${index}:${value}`).sort();
}

export function calculateQuestionRewards(
  question: QuizQuestion,
  isCorrect: boolean,
  hintsUsed: number,
) {
  if (!isCorrect) {
    return {
      earnedCoins: 0,
      earnedPoints: 0,
    };
  }

  return {
    earnedCoins: question.coinReward,
    earnedPoints:
      hintsUsed > 0 ? Math.floor(question.points * 0.5) : question.points,
  };
}

export function getHintCost(hintIndex: number) {
  return hintIndex === 0 ? 1 : 2;
}

export function buildLevelProgressFromAttempt(
  level: QuizLevel,
  previousProgress: QuizLevelProgress,
  completedQuestions: QuizCompletedQuestion[],
) {
  const nextHistory = [
    ...previousProgress.completedQuestions,
    ...completedQuestions,
  ];
  const uniqueQuestionIds = new Set(
    nextHistory.map((completedQuestion) => completedQuestion.questionId),
  );
  const correctCount = nextHistory.filter(
    (completedQuestion) => completedQuestion.isCorrect,
  ).length;
  const incorrectCount = nextHistory.filter(
    (completedQuestion) =>
      !completedQuestion.isCorrect && !completedQuestion.skipped,
  ).length;
  const skippedCount = nextHistory.filter(
    (completedQuestion) => completedQuestion.skipped,
  ).length;
  const totalScore = nextHistory.reduce(
    (accumulator, completedQuestion) =>
      accumulator + completedQuestion.earnedPoints,
    0,
  );
  const totalCoins = nextHistory.reduce(
    (accumulator, completedQuestion) =>
      accumulator + completedQuestion.earnedCoins,
    0,
  );

  const categoryStats = nextHistory.reduce<
    Partial<Record<QuizCategory, QuizLevelProgress["categoryStats"][QuizCategory]>>
  >((accumulator, completedQuestion) => {
    const current = accumulator[completedQuestion.questionCategory] ?? {
      accuracy: 0,
      correct: 0,
      total: 0,
    };

    const nextTotal = current.total + 1;
    const nextCorrect = current.correct + (completedQuestion.isCorrect ? 1 : 0);

    accumulator[completedQuestion.questionCategory] = {
      accuracy: Math.round((nextCorrect / nextTotal) * 100),
      correct: nextCorrect,
      total: nextTotal,
    };

    return accumulator;
  }, {});

  const attemptScore = completedQuestions.reduce(
    (accumulator, completedQuestion) =>
      accumulator + completedQuestion.earnedPoints,
    0,
  );
  const attemptAccuracy =
    completedQuestions.length > 0
      ? Math.round(
          (completedQuestions.filter((item) => item.isCorrect).length /
            completedQuestions.length) *
            100,
        )
      : 0;
  const completionPercentage = Math.round(
    (uniqueQuestionIds.size / quizLevelConfigs[level].questionCount) * 100,
  );

  return {
    averageAccuracy: Math.max(previousProgress.averageAccuracy, attemptAccuracy),
    bestScore: Math.max(previousProgress.bestScore, attemptScore),
    categoryStats,
    completedCount: uniqueQuestionIds.size,
    completedQuestions: nextHistory.slice(-300),
    completionPercentage: Math.min(completionPercentage, 100),
    correctCount,
    incorrectCount,
    lastAttemptDate: completedQuestions.at(-1)?.attemptDate ?? previousProgress.lastAttemptDate,
    skippedCount,
    totalCoins,
    totalQuestions: quizLevelConfigs[level].questionCount,
    totalScore,
  } satisfies QuizLevelProgress;
}

export function mergeQuizProgressSnapshot(
  previousProgress: QuizProgressSnapshot,
  level: QuizLevel,
  completedQuestions: QuizCompletedQuestion[],
) {
  const nextLevelProgress = buildLevelProgressFromAttempt(
    level,
    previousProgress.levelProgress[level],
    completedQuestions,
  );

  const nextSnapshot: QuizProgressSnapshot = {
    ...previousProgress,
    levelProgress: {
      ...previousProgress.levelProgress,
      [level]: nextLevelProgress,
    },
    unlockedLevels: [...previousProgress.unlockedLevels],
  };

  if (isQuizLevelUnlocked(nextSnapshot, "intermediate")) {
    nextSnapshot.unlockedLevels = Array.from(
      new Set([...nextSnapshot.unlockedLevels, "intermediate"]),
    );
  }

  if (isQuizLevelUnlocked(nextSnapshot, "advanced")) {
    nextSnapshot.unlockedLevels = Array.from(
      new Set([...nextSnapshot.unlockedLevels, "advanced"]),
    );
  }

  return nextSnapshot;
}

export function buildQuizAchievements(
  level: QuizLevel,
  summary: QuizAttemptSummary,
  answers: QuizCompletedQuestion[],
  existingAchievements: QuizAchievement[],
) {
  const unlockedAt = new Date().toISOString();
  const nextAchievements = [...existingAchievements];

  const maybeAdd = (
    id: string,
    icon: string,
    label: string,
    description: string,
  ) => {
    if (nextAchievements.some((achievement) => achievement.id === id)) {
      return;
    }

    nextAchievements.push({
      description,
      icon,
      id,
      label,
      unlockedAt,
    });
  };

  if (summary.correctCount > 0) {
    maybeAdd(
      "primeiro-acerto",
      "🎯",
      "Primeiro acerto",
      "Acertou sua primeira questao no quiz guiado.",
    );
  }

  if (summary.accuracy >= 90) {
    maybeAdd(
      `${level}-elite`,
      "👑",
      `Elite ${quizLevelConfigs[level].label}`,
      `Alcancou ${summary.accuracy}% de acerto no nivel ${quizLevelConfigs[level].label}.`,
    );
  }

  if (answers.every((answer) => answer.hintsUsed === 0)) {
    maybeAdd(
      `${level}-sem-dicas`,
      "🧠",
      "Sem dicas",
      "Concluiu um quiz inteiro sem usar nenhuma dica.",
    );
  }

  if (summary.skippedCount === 0) {
    maybeAdd(
      `${level}-sem-pulos`,
      "🚀",
      "Sem pular",
      "Terminou o quiz sem pular nenhuma questao.",
    );
  }

  return nextAchievements;
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
  const bestCategory = Object.entries(progress.categoryStats).sort(
    (a, b) => b[1].accuracy - a[1].accuracy,
  )[0]?.[0] as QuizCategory | undefined;

  return {
    accuracy,
    bestCategory: bestCategory ?? null,
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

export function buildAttemptRecord(
  id: string,
  level: QuizLevel,
  answers: QuizCompletedQuestion[],
  achievements: QuizAchievement[],
) {
  const levelProgress = buildLevelProgressFromAttempt(
    level,
    buildEmptyLevelProgress(level),
    answers,
  );
  const summary = calculateQuizAttemptSummary(level, levelProgress);
  const questions = getQuizLevelQuestions(level);

  const reviewItems = buildQuizReviewItems(questions, answers);
  const startedAt = answers[0]?.attemptDate ?? new Date().toISOString();
  const completedAt = answers.at(-1)?.attemptDate ?? new Date().toISOString();

  return {
    achievements,
    answers,
    completedAt,
    id,
    level,
    reviewItems,
    startedAt,
    status: "completed",
    summary,
  } satisfies QuizAttemptRecord;
}
