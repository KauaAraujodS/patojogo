"use client";

import { useEffect, useState } from "react";
import type {
  QuizLevel,
  QuizProgressSnapshot,
} from "@/data/questions";
import { flushQueuedQuizSync } from "@/lib/quiz/client";
import {
  buildEmptyLevelProgress,
  buildDefaultQuizProgress,
  getQuizStars,
  isQuizLevelUnlocked,
} from "@/utils/quizHelpers";

const STORAGE_PREFIX = "patojogo.quiz.progress";

function getStorageKey(userId: string) {
  return `${STORAGE_PREFIX}.${userId}`;
}

function getProgressWeight(progress: QuizProgressSnapshot) {
  return Object.values(progress.levelProgress).reduce(
    (accumulator, levelProgress) =>
      accumulator +
      levelProgress.totalScore +
      levelProgress.completedCount * 10 +
      levelProgress.totalCoins,
    0,
  );
}

function normalizeProgressSnapshot(
  initialProgress: QuizProgressSnapshot,
  value: unknown,
) {
  const base = buildDefaultQuizProgress(initialProgress.userId);

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return initialProgress;
  }

  const candidate = value as Partial<QuizProgressSnapshot>;
  const candidateLevelProgress =
    candidate.levelProgress &&
    typeof candidate.levelProgress === "object" &&
    !Array.isArray(candidate.levelProgress)
      ? (candidate.levelProgress as Partial<QuizProgressSnapshot["levelProgress"]>)
      : ({} as Partial<QuizProgressSnapshot["levelProgress"]>);

  return {
    ...base,
    ...initialProgress,
    achievements: Array.isArray(candidate.achievements)
      ? candidate.achievements
      : initialProgress.achievements,
    levelProgress: {
      beginner: {
        ...buildEmptyLevelProgress("beginner"),
        ...initialProgress.levelProgress.beginner,
        ...candidateLevelProgress.beginner,
      },
      intermediate: {
        ...buildEmptyLevelProgress("intermediate"),
        ...initialProgress.levelProgress.intermediate,
        ...candidateLevelProgress.intermediate,
      },
      advanced: {
        ...buildEmptyLevelProgress("advanced"),
        ...initialProgress.levelProgress.advanced,
        ...candidateLevelProgress.advanced,
      },
    },
    unlockedLevels: Array.isArray(candidate.unlockedLevels)
      ? candidate.unlockedLevels.filter(
          (level): level is QuizLevel =>
            level === "beginner" ||
            level === "intermediate" ||
            level === "advanced",
        )
      : initialProgress.unlockedLevels,
    userId: initialProgress.userId,
  } satisfies QuizProgressSnapshot;
}

function getPreferredProgress(
  initialProgress: QuizProgressSnapshot,
  storedProgress: QuizProgressSnapshot | null,
) {
  if (!storedProgress) {
    return initialProgress;
  }

  return getProgressWeight(storedProgress) >= getProgressWeight(initialProgress)
    ? storedProgress
    : initialProgress;
}

export function useQuizProgress(initialProgress: QuizProgressSnapshot) {
  const [progress, setProgress] = useState(() => {
    if (typeof window === "undefined") {
      return initialProgress;
    }

    const rawValue = window.localStorage.getItem(
      getStorageKey(initialProgress.userId),
    );

    if (!rawValue) {
      return initialProgress;
    }

    try {
      const parsed = normalizeProgressSnapshot(
        initialProgress,
        JSON.parse(rawValue),
      );

      return getPreferredProgress(initialProgress, parsed);
    } catch {
      return initialProgress;
    }
  });

  useEffect(() => {
    const storageKey = getStorageKey(initialProgress.userId);
    const rawValue = window.localStorage.getItem(storageKey);
    let nextProgress = initialProgress;

    if (rawValue) {
      try {
        nextProgress = getPreferredProgress(
          initialProgress,
          normalizeProgressSnapshot(initialProgress, JSON.parse(rawValue)),
        );
      } catch {
        nextProgress = initialProgress;
      }
    }

    window.localStorage.setItem(storageKey, JSON.stringify(nextProgress));

    void flushQueuedQuizSync();
  }, [initialProgress]);

  function persistProgress(nextProgress: QuizProgressSnapshot) {
    setProgress(nextProgress);
    window.localStorage.setItem(
      getStorageKey(nextProgress.userId),
      JSON.stringify(nextProgress),
    );
  }

  function saveLevelProgress(
    level: QuizLevel,
    updates: Partial<QuizProgressSnapshot["levelProgress"][QuizLevel]>,
  ) {
    const nextProgress: QuizProgressSnapshot = {
      ...progress,
      levelProgress: {
        ...progress.levelProgress,
        [level]: {
          ...progress.levelProgress[level],
          ...updates,
        },
      },
      unlockedLevels: [...progress.unlockedLevels],
    };

    if (
      level === "beginner" &&
      isQuizLevelUnlocked(nextProgress, "intermediate") &&
      !nextProgress.unlockedLevels.includes("intermediate")
    ) {
      nextProgress.unlockedLevels.push("intermediate");
    }

    if (
      level === "intermediate" &&
      isQuizLevelUnlocked(nextProgress, "advanced") &&
      !nextProgress.unlockedLevels.includes("advanced")
    ) {
      nextProgress.unlockedLevels.push("advanced");
    }

    persistProgress(nextProgress);
  }

  function resetQuizProgress() {
    persistProgress(buildDefaultQuizProgress(progress.userId));
  }

  return {
    getStars: getQuizStars,
    persistProgress,
    progress,
    resetQuizProgress,
    saveLevelProgress,
  };
}
