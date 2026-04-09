import { Button } from "@/components/ui/button";
import {
  BodyText,
  Caption,
  DisplayTitle,
  Eyebrow,
  Lead,
  SectionTitle,
} from "@/components/ui/typography";
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
          ? "border-success/15 bg-success/10 text-success"
          : "border-warning/15 bg-warning/10 text-warning",
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
    <main className="app-shell">
      <div className="app-container flex flex-col gap-6">
        <section className="overflow-hidden rounded-[var(--radius-hero)] border border-panel-border bg-surface shadow-[var(--shadow-card)] backdrop-blur">
          <div className="grid gap-10 px-7 py-8 md:grid-cols-[1.3fr_0.7fr] md:px-10 md:py-10">
            <div className="space-y-5">
              <Eyebrow className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1">
                Base criada
              </Eyebrow>
              <div className="space-y-3">
                <DisplayTitle className="max-w-3xl">
                  {appName} com Next.js e Supabase prontos para crescer.
                </DisplayTitle>
                <Lead className="max-w-2xl">
                  O repositório já está conectado ao GitHub, o projeto do
                  Supabase já está vinculado localmente e o app já conhece as
                  credenciais públicas para começar a desenvolver.
                </Lead>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg">Criar primeira feature</Button>
                <Button size="lg" variant="secondary">
                  Abrir documentação do padrão
                </Button>
              </div>
            </div>

            <div className="rounded-[var(--radius-card)] border border-panel-border bg-surface-strong p-5 shadow-[var(--shadow-soft)]">
              <SectionTitle>Status atual</SectionTitle>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-3 rounded-[var(--radius-button)] border border-border-strong/60 bg-black/[0.025] px-4 py-3">
                  <span className="font-medium">GitHub remoto</span>
                  <StatusBadge ready />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-[var(--radius-button)] border border-border-strong/60 bg-black/[0.025] px-4 py-3">
                  <span className="font-medium">Supabase</span>
                  <StatusBadge ready={supabaseReady} />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-[var(--radius-button)] border border-border-strong/60 bg-black/[0.025] px-4 py-3">
                  <span className="font-medium">App Router</span>
                  <StatusBadge ready />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[var(--radius-card)] border border-panel-border bg-surface p-7 shadow-[var(--shadow-soft)] backdrop-blur">
            <SectionTitle>Stack</SectionTitle>
            <ul className="mt-5 space-y-3">
              {stack.map((item) => (
                <li
                  key={item}
                  className="rounded-[var(--radius-button)] border border-border-strong/60 px-4 py-3"
                >
                  <BodyText>{item}</BodyText>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[var(--radius-card)] border border-panel-border bg-surface p-7 shadow-[var(--shadow-soft)] backdrop-blur">
            <SectionTitle>Próximos passos</SectionTitle>
            <ol className="mt-5 space-y-3">
              {nextSteps.map((step, index) => (
                <li
                  key={step}
                  className="rounded-[var(--radius-button)] border border-border-strong/60 px-4 py-3"
                >
                  <BodyText>
                    {index + 1}. {step}
                  </BodyText>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-[var(--radius-card)] border border-panel-border bg-[#201912] p-5 text-stone-100">
              <Caption className="mb-3 text-stone-300">Check rápido</Caption>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono leading-7">
                {[
                  "npm run dev",
                  "npm run lint",
                  "npm run typecheck",
                  "npm run build",
                ].join("\n")}
              </pre>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
