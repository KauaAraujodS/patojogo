"use client";

import { useEffect, useState } from "react";
import {
  type QuizLevel,
  type QuizProgressSnapshot,
} from "@/data/questions";
  import {
  buildDefaultQuizProgress,
  getQuizStars,
  isQuizLevelUnlocked,
} from "@/utils/quizHelpers";

const STORAGE_PREFIX = "patojogo.quiz.progress";

function getStorageKey(userId: string) {
  return `${STORAGE_PREFIX}.${userId}`;
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
      return JSON.parse(rawValue) as QuizProgressSnapshot;
    } catch {
      return initialProgress;
    }
  });
  useEffect(() => {
    const storageKey = getStorageKey(initialProgress.userId);
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      window.localStorage.setItem(storageKey, JSON.stringify(initialProgress));
    }
  }, [initialProgress]);

  function persist(nextProgress: QuizProgressSnapshot) {
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

    persist(nextProgress);
  }

  function resetQuizProgress() {
    persist(buildDefaultQuizProgress(progress.userId));
  }

  return {
    getStars: getQuizStars,
    progress,
    resetQuizProgress,
    saveLevelProgress,
  };
}
