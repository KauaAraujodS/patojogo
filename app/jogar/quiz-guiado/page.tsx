import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function QuizGuiadoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, progress_step, score")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/");
  }

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,rgba(103,141,255,0.24),transparent_22%),linear-gradient(180deg,#1e2f83_0%,#223da9_54%,#202a87_100%)] px-4 py-4 text-white">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[32rem] flex-col">
        <div className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-white/10 bg-[#12205b]/50 px-4 py-3 shadow-[0_18px_45px_rgba(7,12,40,0.32)] backdrop-blur sm:px-5 sm:py-4">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#a7bcff]">
              Quiz guiado
            </p>
            <p className="mt-1 text-sm text-white/88">
              Primeira base do modo de estudo
            </p>
          </div>

          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/8 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/12"
            href="/"
          >
            Voltar
          </Link>
        </div>

        <section className="mt-4 rounded-[2rem] bg-[linear-gradient(135deg,#265eff_0%,#2042d8_55%,#182d8b_100%)] px-5 py-6 shadow-[0_28px_60px_rgba(18,20,85,0.3)] sm:px-6 sm:py-7">
          <p className="text-sm text-[#d7e5ff]">
            Ola, {profile.full_name}
          </p>
          <h1 className="mt-3 text-[2rem] font-semibold tracking-tight text-white sm:text-[2.4rem]">
            Quiz guiado
          </h1>
          <p className="mt-3 max-w-[24rem] text-[0.96rem] leading-7 text-[#eaf2ff]">
            Esta nova página já está criada. O próximo passo é montar a primeira
            questão e o fluxo de resposta do quiz.
          </p>
        </section>

        <section className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#12205b]/45 p-5 shadow-[0_18px_40px_rgba(7,12,40,0.22)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#9cb5ff]">
              Progresso
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              Etapa {profile.progress_step}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-[#12205b]/45 p-5 shadow-[0_18px_40px_rgba(7,12,40,0.22)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#9cb5ff]">
              Pontuação
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {profile.score} pts
            </p>
          </div>
        </section>

        <section className="mt-4 flex flex-1 rounded-[1.8rem] border border-dashed border-white/12 bg-white/[0.03] p-5 shadow-[0_18px_40px_rgba(7,12,40,0.16)]">
          <div className="self-end">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#9cb5ff]">
              Próxima etapa
            </p>
            <p className="mt-3 max-w-[26rem] text-sm leading-7 text-[#d7e5ff]">
              Aqui vamos construir o enunciado, as alternativas, o botão de
              avançar e a lógica de pontuação.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
