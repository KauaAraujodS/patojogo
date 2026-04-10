import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  QuizAchievement,
  QuizAttemptRecord,
  QuizProgressSnapshot,
} from "@/data/questions";
import type { Database, Tables } from "@/lib/database.types";
import {
  buildDefaultQuizProgress,
  buildQuizReviewItems,
  getQuizLevelQuestions,
  stringifyQuizAnswer,
} from "@/utils/quizHelpers";

type ServerClient = SupabaseClient<Database>;

export async function getQuizProgressSnapshotForUser(
  supabase: ServerClient,
  userId: string,
) {
  const { data } = await supabase
    .from("quiz_progress")
    .select("user_id, unlocked_levels, level_progress, achievements")
    .eq("user_id", userId)
    .maybeSingle();

  return normalizeQuizProgressRow(data, userId);
}

export async function getQuizLatestAttemptForUser(
  supabase: ServerClient,
  userId: string,
  level?: string,
) {
  let query = supabase
    .from("quiz_attempts")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(1);

  if (level) {
    query = query.eq("level", level);
  }

  const { data } = await query.maybeSingle();

  return normalizeQuizAttemptRow(data);
}

export async function getQuizAttemptById(
  supabase: ServerClient,
  userId: string,
  attemptId: string,
) {
  const { data } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("id", attemptId)
    .eq("user_id", userId)
    .maybeSingle();

  return normalizeQuizAttemptRow(data);
}

export function normalizeQuizProgressRow(
  row:
    | Pick<
        Tables<"quiz_progress">,
        "achievements" | "level_progress" | "unlocked_levels" | "user_id"
      >
    | null,
  userId: string,
) {
  const base = buildDefaultQuizProgress(userId);

  if (!row) {
    return base;
  }

  const nextProgress: QuizProgressSnapshot = {
    ...base,
    achievements: Array.isArray(row.achievements)
      ? (row.achievements as QuizAchievement[])
      : base.achievements,
    unlockedLevels: Array.isArray(row.unlocked_levels)
      ? (row.unlocked_levels as QuizProgressSnapshot["unlockedLevels"])
      : base.unlockedLevels,
    userId: row.user_id,
  };

  if (
    row.level_progress &&
    typeof row.level_progress === "object" &&
    !Array.isArray(row.level_progress)
  ) {
    nextProgress.levelProgress = {
      ...base.levelProgress,
      ...(row.level_progress as QuizProgressSnapshot["levelProgress"]),
    };
  }

  return nextProgress;
}

export function normalizeQuizAttemptRow(
  row: Tables<"quiz_attempts"> | null,
) {
  if (!row) {
    return null;
  }

  const answers = Array.isArray(row.answers)
    ? (row.answers as QuizAttemptRecord["answers"])
    : [];
  const summary =
    row.summary && typeof row.summary === "object" && !Array.isArray(row.summary)
      ? (row.summary as QuizAttemptRecord["summary"])
      : null;
  const levelQuestions = getQuizLevelQuestions(row.level as QuizAttemptRecord["level"]);
  const summaryPayload =
    row.summary && typeof row.summary === "object" && !Array.isArray(row.summary)
      ? (row.summary as {
          achievements?: QuizAchievement[];
          reviewItems?: QuizAttemptRecord["reviewItems"];
        } & QuizAttemptRecord["summary"])
      : null;
  const reviewItems =
    summaryPayload?.reviewItems && Array.isArray(summaryPayload.reviewItems)
      ? summaryPayload.reviewItems
      : buildQuizReviewItems(levelQuestions, answers);

  return {
    achievements: summaryPayload?.achievements ?? [],
    answers,
    completedAt: row.completed_at,
    id: row.id,
    level: row.level as QuizAttemptRecord["level"],
    reviewItems: reviewItems.map((item) => ({
      ...item,
      selectedAnswerLabel: item.selectedAnswerLabel
        ? item.selectedAnswerLabel
        : stringifyQuizAnswer(null),
    })),
    startedAt: row.started_at,
    status: row.status as QuizAttemptRecord["status"],
    summary:
      summary ??
      ({
        accuracy: row.accuracy,
        bestCategory: null,
        categoryToReview: null,
        correctCount: row.correct_count,
        earnedCoins: row.total_coins,
        earnedPoints: row.total_score,
        incorrectCount: row.incorrect_count,
        level: row.level,
        skippedCount: row.skipped_count,
        stars: 0,
        timePerQuestion: 0,
        totalQuestions:
          row.correct_count + row.incorrect_count + row.skipped_count,
        totalTimeInSeconds: row.total_time_seconds,
      } as QuizAttemptRecord["summary"]),
  } satisfies QuizAttemptRecord;
}
