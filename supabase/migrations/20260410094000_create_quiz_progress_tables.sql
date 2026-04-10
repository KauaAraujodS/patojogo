alter table public.profiles
  add column if not exists coins integer not null default 0 check (coins >= 0);

create or replace function public.default_quiz_level_progress()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'beginner',
    jsonb_build_object(
      'averageAccuracy', 0,
      'bestScore', 0,
      'categoryStats', jsonb_build_object(),
      'completedCount', 0,
      'completedQuestions', jsonb_build_array(),
      'completionPercentage', 0,
      'correctCount', 0,
      'incorrectCount', 0,
      'lastAttemptDate', null,
      'skippedCount', 0,
      'totalCoins', 0,
      'totalQuestions', 30,
      'totalScore', 0
    ),
    'intermediate',
    jsonb_build_object(
      'averageAccuracy', 0,
      'bestScore', 0,
      'categoryStats', jsonb_build_object(),
      'completedCount', 0,
      'completedQuestions', jsonb_build_array(),
      'completionPercentage', 0,
      'correctCount', 0,
      'incorrectCount', 0,
      'lastAttemptDate', null,
      'skippedCount', 0,
      'totalCoins', 0,
      'totalQuestions', 30,
      'totalScore', 0
    ),
    'advanced',
    jsonb_build_object(
      'averageAccuracy', 0,
      'bestScore', 0,
      'categoryStats', jsonb_build_object(),
      'completedCount', 0,
      'completedQuestions', jsonb_build_array(),
      'completionPercentage', 0,
      'correctCount', 0,
      'incorrectCount', 0,
      'lastAttemptDate', null,
      'skippedCount', 0,
      'totalCoins', 0,
      'totalQuestions', 30,
      'totalScore', 0
    )
  );
$$;

create or replace function public.sync_quiz_totals_to_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    score = greatest(coalesce(new.total_points, 0), 0),
    coins = greatest(coalesce(new.total_coins, 0), 0),
    progress_step = greatest(coalesce(progress_step, 0), coalesce(new.completed_quiz_count, 0))
  where id = new.user_id;

  return new;
end;
$$;

create table if not exists public.quiz_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  unlocked_levels text[] not null default array['beginner']::text[],
  level_progress jsonb not null default public.default_quiz_level_progress(),
  achievements jsonb not null default '[]'::jsonb,
  total_points integer not null default 0 check (total_points >= 0),
  total_coins integer not null default 0 check (total_coins >= 0),
  completed_quiz_count integer not null default 0 check (completed_quiz_count >= 0),
  last_synced_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  status text not null default 'completed' check (status in ('completed', 'abandoned')),
  summary jsonb not null default '{}'::jsonb,
  answers jsonb not null default '[]'::jsonb,
  total_score integer not null default 0 check (total_score >= 0),
  total_coins integer not null default 0 check (total_coins >= 0),
  accuracy integer not null default 0 check (accuracy between 0 and 100),
  correct_count integer not null default 0 check (correct_count >= 0),
  incorrect_count integer not null default 0 check (incorrect_count >= 0),
  skipped_count integer not null default 0 check (skipped_count >= 0),
  hints_used integer not null default 0 check (hints_used >= 0),
  total_time_seconds integer not null default 0 check (total_time_seconds >= 0),
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists quiz_attempts_user_id_idx
  on public.quiz_attempts (user_id);

create index if not exists quiz_attempts_user_level_completed_idx
  on public.quiz_attempts (user_id, level, completed_at desc);

alter table public.quiz_progress enable row level security;
alter table public.quiz_attempts enable row level security;

drop trigger if exists quiz_progress_set_updated_at on public.quiz_progress;
create trigger quiz_progress_set_updated_at
  before update on public.quiz_progress
  for each row execute procedure public.set_updated_at();

drop trigger if exists quiz_attempts_set_updated_at on public.quiz_attempts;
create trigger quiz_attempts_set_updated_at
  before update on public.quiz_attempts
  for each row execute procedure public.set_updated_at();

drop trigger if exists sync_quiz_totals_to_profile_trigger on public.quiz_progress;
create trigger sync_quiz_totals_to_profile_trigger
  after insert or update on public.quiz_progress
  for each row execute procedure public.sync_quiz_totals_to_profile();

drop policy if exists "quiz_progress_select_own" on public.quiz_progress;
create policy "quiz_progress_select_own"
  on public.quiz_progress
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "quiz_progress_insert_own" on public.quiz_progress;
create policy "quiz_progress_insert_own"
  on public.quiz_progress
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "quiz_progress_update_own" on public.quiz_progress;
create policy "quiz_progress_update_own"
  on public.quiz_progress
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "quiz_attempts_select_own" on public.quiz_attempts;
create policy "quiz_attempts_select_own"
  on public.quiz_attempts
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "quiz_attempts_insert_own" on public.quiz_attempts;
create policy "quiz_attempts_insert_own"
  on public.quiz_attempts
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "quiz_attempts_update_own" on public.quiz_attempts;
create policy "quiz_attempts_update_own"
  on public.quiz_attempts
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
