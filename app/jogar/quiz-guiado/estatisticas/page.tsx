import Link from "next/link";
import { redirect } from "next/navigation";
import { QuizStats } from "@/components/game/quiz/QuizStats";
import { quizLevelOrder } from "@/data/questions";
import { getQuizLatestAttemptForUser, getQuizProgressSnapshotForUser } from "@/lib/quiz/server";
import { createClient } from "@/lib/supabase/server";

export default async function QuizStatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const progress = await getQuizProgressSnapshotForUser(supabase, user.id);
  const latestAttemptsEntries = await Promise.all(
    quizLevelOrder.map(async (level) => [
      level,
      await getQuizLatestAttemptForUser(supabase, user.id, level),
    ] as const),
  );
  const latestAttempts = Object.fromEntries(latestAttemptsEntries);

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,rgba(103,141,255,0.24),transparent_22%),linear-gradient(180deg,#1e2f83_0%,#223da9_54%,#202a87_100%)] text-white">
      <section className="mx-auto flex min-h-[100dvh] w-full max-w-5xl items-center px-4 py-8 sm:px-6">
        <div className="w-full space-y-5">
          <div className="rounded-[2rem] border border-white/10 bg-[#12205b]/36 p-6 shadow-[0_24px_60px_rgba(7,12,40,0.28)]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9fb5ff]">
              Estatisticas gerais
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
              Historico do quiz guiado
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d7e5ff] sm:text-base">
              Aqui fica o panorama completo da sua performance, progresso por nivel
              e conquistas desbloqueadas ao longo da palestra.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.18fr,0.82fr]">
            <div className="rounded-[1.8rem] border border-white/10 bg-[#12205b]/36 p-5 shadow-[0_20px_45px_rgba(10,12,40,0.22)]">
              <QuizStats
                latestAttempts={latestAttempts}
                progress={progress}
                variant="overall"
              />
            </div>

            <div className="space-y-4 rounded-[1.8rem] border border-white/10 bg-[#12205b]/36 p-5 shadow-[0_20px_45px_rgba(10,12,40,0.22)]">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9fb5ff]">
                  Conquistas
                </p>
                <div className="mt-3 space-y-2">
                  {progress.achievements.length > 0 ? (
                    progress.achievements.map((achievement) => (
                      <div
                        className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-3"
                        key={achievement.id}
                      >
                        <p className="text-sm font-semibold text-white">
                          {achievement.icon} {achievement.label}
                        </p>
                        <p className="mt-1 text-xs leading-6 text-[#d7e5ff]">
                          {achievement.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1rem] border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-[#c8d5ff]">
                      Complete suas primeiras rodadas para liberar as conquistas.
                    </div>
                  )}
                </div>
              </div>

              <Link
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[1.15rem] border border-white/10 bg-white/7 px-4 text-sm font-semibold text-white/88"
                href="/jogar/quiz-guiado"
              >
                Voltar para os niveis
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
