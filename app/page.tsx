import { hasSupabaseEnv } from "@/lib/env";

const nextSteps = [
  "criar a primeira migration do banco",
  "montar a tela inicial real do produto",
  "ligar autenticacao com Supabase Auth",
  "definir a primeira tabela de dominio",
];

const stack = [
  "Next.js 16 com App Router",
  "TypeScript",
  "Tailwind CSS 4",
  "Supabase SSR com proxy.ts",
];

function StatusBadge({ ready }: { ready: boolean }) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]",
        ready
          ? "border-emerald-700/15 bg-emerald-600/10 text-emerald-700"
          : "border-amber-700/15 bg-amber-500/10 text-amber-800",
      ].join(" ")}
    >
      {ready ? "Conectado" : "Pendente"}
    </span>
  );
}

export default function Home() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Pato Jogo";
  const supabaseReady = hasSupabaseEnv();

  return (
    <main className="min-h-screen px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-panel-border bg-panel shadow-[0_30px_80px_rgba(85,56,22,0.08)] backdrop-blur">
          <div className="grid gap-10 px-7 py-8 md:grid-cols-[1.3fr_0.7fr] md:px-10 md:py-10">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-accent-strong">
                Base criada
              </span>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                  {appName} com Next.js e Supabase prontos para crescer.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted md:text-lg">
                  O repositório já está conectado ao GitHub, o projeto do
                  Supabase já está vinculado localmente e o app já conhece as
                  credenciais públicas para começar a desenvolver.
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-panel-border bg-white/70 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted">
                Status atual
              </p>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-black/6 bg-black/[0.025] px-4 py-3">
                  <span className="font-medium">GitHub remoto</span>
                  <StatusBadge ready />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-black/6 bg-black/[0.025] px-4 py-3">
                  <span className="font-medium">Supabase</span>
                  <StatusBadge ready={supabaseReady} />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-black/6 bg-black/[0.025] px-4 py-3">
                  <span className="font-medium">App Router</span>
                  <StatusBadge ready />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[1.75rem] border border-panel-border bg-panel p-7 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted">
              Stack
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-muted md:text-base">
              {stack.map((item) => (
                <li key={item} className="rounded-2xl border border-black/6 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[1.75rem] border border-panel-border bg-panel p-7 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted">
              Proximos passos
            </p>
            <ol className="mt-5 space-y-3 text-sm leading-7 text-muted md:text-base">
              {nextSteps.map((step, index) => (
                <li key={step} className="rounded-2xl border border-black/6 px-4 py-3">
                  {index + 1}. {step}
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-[1.5rem] border border-panel-border bg-[#201912] p-5 text-sm text-stone-100">
              <p className="mb-3 font-semibold text-stone-50">Check rapido</p>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono leading-7">
                {["npm run dev", "npm run lint", "npm run typecheck", "npm run build"].join("\n")}
              </pre>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
