"use client";

import { createClient } from "@/lib/supabase/client";
import type { TablesInsert } from "@/lib/database.types";
import type {
  QuizAchievement,
  QuizAttemptRecord,
  QuizProgressSnapshot,
} from "@/data/questions";

const PENDING_SYNC_KEY = "patojogo.quiz.pending-sync";
const LAST_ATTEMPT_PREFIX = "patojogo.quiz.last-attempt";

type PendingSyncPayload = {
  achievements: QuizAchievement[];
  attempt: QuizAttemptRecord;
  progress: QuizProgressSnapshot;
  userId: string;
};

function getLastAttemptKey(userId: string, level: string) {
  return `${LAST_ATTEMPT_PREFIX}.${userId}.${level}`;
}

export function storeLastQuizAttempt(attempt: QuizAttemptRecord, userId: string) {
  window.localStorage.setItem(
    getLastAttemptKey(userId, attempt.level),
    JSON.stringify(attempt),
  );
}

export function getLastQuizAttempt(userId: string, level: string) {
  const rawValue = window.localStorage.getItem(getLastAttemptKey(userId, level));

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as QuizAttemptRecord;
  } catch {
    return null;
  }
}

export function getStoredQuizAttemptById(userId: string, level: string, attemptId: string) {
  const attempt = getLastQuizAttempt(userId, level);

  if (!attempt || attempt.id !== attemptId) {
    return null;
  }

  return attempt;
}

function readPendingPayloads() {
  const rawValue = window.localStorage.getItem(PENDING_SYNC_KEY);

  if (!rawValue) {
    return [] as PendingSyncPayload[];
  }

  try {
    return JSON.parse(rawValue) as PendingSyncPayload[];
  } catch {
    return [];
  }
}

function writePendingPayloads(payloads: PendingSyncPayload[]) {
  window.localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(payloads));
}

export function queueQuizSync(payload: PendingSyncPayload) {
  const nextPayloads = [...readPendingPayloads(), payload];
  writePendingPayloads(nextPayloads);
}

export async function flushQueuedQuizSync() {
  const pendingPayloads = readPendingPayloads();

  if (pendingPayloads.length === 0) {
    return;
  }

  const remainingPayloads: PendingSyncPayload[] = [];

  for (const payload of pendingPayloads) {
    try {
      await syncQuizProgressToSupabase(payload);
    } catch {
      remainingPayloads.push(payload);
    }
  }

  writePendingPayloads(remainingPayloads);
}

export async function syncQuizProgressToSupabase(payload: PendingSyncPayload) {
  const supabase = createClient();
  const completedQuizCount = Object.values(payload.progress.levelProgress).reduce(
    (accumulator, levelProgress) =>
      accumulator +
      (levelProgress.completedQuestions.length > 0 ? 1 : 0),
    0,
  );

  const progressPayload: TablesInsert<"quiz_progress"> = {
    achievements: payload.progress.achievements,
    completed_quiz_count: completedQuizCount,
    last_synced_at: new Date().toISOString(),
    level_progress: payload.progress.levelProgress,
    total_coins: Object.values(payload.progress.levelProgress).reduce(
      (accumulator, levelProgress) => accumulator + levelProgress.totalCoins,
      0,
    ),
    total_points: Object.values(payload.progress.levelProgress).reduce(
      (accumulator, levelProgress) => accumulator + levelProgress.totalScore,
      0,
    ),
    unlocked_levels: payload.progress.unlockedLevels,
    user_id: payload.userId,
  };

  const { error: progressError } = await supabase
    .from("quiz_progress")
    .upsert(progressPayload, { onConflict: "user_id" });

  if (progressError) {
    throw progressError;
  }

  const attemptPayload: TablesInsert<"quiz_attempts"> = {
    accuracy: payload.attempt.summary.accuracy,
    answers: payload.attempt.answers,
    completed_at: payload.attempt.completedAt,
    correct_count: payload.attempt.summary.correctCount,
    hints_used: payload.attempt.answers.reduce(
      (accumulator, answer) => accumulator + answer.hintsUsed,
      0,
    ),
    id: payload.attempt.id,
    incorrect_count: payload.attempt.summary.incorrectCount,
    level: payload.attempt.level,
    skipped_count: payload.attempt.summary.skippedCount,
    started_at: payload.attempt.startedAt,
    status: payload.attempt.status,
    summary: {
      ...payload.attempt.summary,
      achievements: payload.attempt.achievements,
      reviewItems: payload.attempt.reviewItems,
    },
    total_coins: payload.attempt.summary.earnedCoins,
    total_score: payload.attempt.summary.earnedPoints,
    total_time_seconds: payload.attempt.summary.totalTimeInSeconds,
    user_id: payload.userId,
  };

  const { error: attemptError } = await supabase
    .from("quiz_attempts")
    .upsert(attemptPayload, { onConflict: "id" });

  if (attemptError) {
    throw attemptError;
  }

  return payload.attempt.id;
}
