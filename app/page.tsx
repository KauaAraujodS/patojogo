import { AuthPanel } from "@/components/auth/auth-panel";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import {
  BodyText,
  Caption,
  DisplayTitle,
  Eyebrow,
  Lead,
  SectionTitle,
} from "@/components/ui/typography";
import type { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

const benefits = [
  "salvar o progresso em tempo real durante a palestra",
  "acompanhar a pontuacao acumulada",
  "visualizar a colocacao final no ranking",
  "garantir identificacao para entrega de brinde",
];

const scoreRules = [
  "cada etapa concluida aumenta o progresso",
  "interacoes certas somam pontos para o ranking",
  "ao final, cada participante ve sua colocacao",
];

type Profile = Pick<
  Tables<"profiles">,
  "email" | "full_name" | "phone" | "progress_step" | "score"
>;

function SignedInCard({ profile }: { profile: Profile }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-panel-border bg-surface p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Eyebrow className="inline-flex rounded-full border border-success/20 bg-success/10 px-3 py-1 text-success">
            Sessao ativa
          </Eyebrow>
          <div>
            <DisplayTitle className="text-3xl md:text-5xl">
              Bem-vindo, {profile.full_name}.
            </DisplayTitle>
            <Lead className="mt-3 max-w-2xl">
              Sua conta já está pronta para registrar progresso, pontos e
              resultado final da palestra.
            </Lead>
          </div>
        </div>

        <SignOutButton />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[var(--radius-button)] border border-border-strong/60 bg-surface-strong p-4">
          <Caption>Nome</Caption>
          <BodyText className="mt-2 text-foreground">{profile.full_name}</BodyText>
        </div>
        <div className="rounded-[var(--radius-button)] border border-border-strong/60 bg-surface-strong p-4">
          <Caption>Email</Caption>
          <BodyText className="mt-2 text-foreground">{profile.email}</BodyText>
        </div>
        <div className="rounded-[var(--radius-button)] border border-border-strong/60 bg-surface-strong p-4">
          <Caption>Telefone</Caption>
          <BodyText className="mt-2 text-foreground">{profile.phone}</BodyText>
        </div>
        <div className="rounded-[var(--radius-button)] border border-border-strong/60 bg-surface-strong p-4">
          <Caption>Pontuacao inicial</Caption>
          <BodyText className="mt-2 text-foreground">{profile.score} pontos</BodyText>
        </div>
      </div>

      <div className="mt-6 rounded-[var(--radius-card)] border border-panel-border bg-[#201912] p-5 text-stone-100">
        <Caption className="text-stone-300">Estado atual do participante</Caption>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <BodyText className="text-stone-200">
            Progresso salvo: etapa {profile.progress_step}
          </BodyText>
          <BodyText className="text-stone-200">
            Ranking: pronto para ser calculado conforme as interacoes da
            palestra
          </BodyText>
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("email, full_name, phone, progress_step, score")
      .eq("id", user.id)
      .maybeSingle();

    profile = data;
  }

  return (
    <main className="app-shell">
      <div className="app-container flex flex-col gap-6">
        {!profile ? (
          <>
            <section className="overflow-hidden rounded-[var(--radius-hero)] border border-panel-border bg-surface shadow-[var(--shadow-card)] backdrop-blur">
              <div className="grid gap-10 px-7 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-10">
                <div className="space-y-5">
                  <Eyebrow className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1">
                    Entrada da palestra
                  </Eyebrow>
                  <div className="space-y-3">
                    <DisplayTitle className="max-w-3xl">
                      Cadastro e login para participar, salvar progresso e
                      disputar o ranking final.
                    </DisplayTitle>
                    <Lead className="max-w-2xl">
                      Este app funciona como a experiencia paralela da palestra.
                      Cada participante entra com conta propria para registrar
                      avanco, pontos e competir pelo brinde no encerramento.
                    </Lead>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button size="lg">Entrar na palestra</Button>
                    <Button size="lg" variant="secondary">
                      Ver como funciona
                    </Button>
                  </div>
                </div>

                <div className="rounded-[var(--radius-card)] border border-panel-border bg-surface-strong p-5 shadow-[var(--shadow-soft)]">
                  <SectionTitle>O que a conta libera</SectionTitle>
                  <ul className="mt-5 space-y-3">
                    {benefits.map((item) => (
                      <li
                        key={item}
                        className="rounded-[var(--radius-button)] border border-border-strong/60 px-4 py-3"
                      >
                        <BodyText>{item}</BodyText>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <article className="rounded-[var(--radius-card)] border border-panel-border bg-surface p-7 shadow-[var(--shadow-soft)] backdrop-blur">
                <SectionTitle>Como o ranking funciona</SectionTitle>
                <ol className="mt-5 space-y-3">
                  {scoreRules.map((rule, index) => (
                    <li
                      key={rule}
                      className="rounded-[var(--radius-button)] border border-border-strong/60 px-4 py-3"
                    >
                      <BodyText>
                        {index + 1}. {rule}
                      </BodyText>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 rounded-[var(--radius-card)] border border-panel-border bg-[#201912] p-5 text-stone-100">
                  <Caption className="text-stone-300">Dados captados</Caption>
                  <div className="mt-3 space-y-2">
                    <BodyText className="text-stone-200">
                      Nome para identificar o participante
                    </BodyText>
                    <BodyText className="text-stone-200">
                      Email para autenticacao e retomada do acesso
                    </BodyText>
                    <BodyText className="text-stone-200">
                      Telefone para contato e validacao do brinde
                    </BodyText>
                  </div>
                </div>
              </article>

              <AuthPanel />
            </section>
          </>
        ) : (
          <SignedInCard profile={profile} />
        )}
      </div>
    </main>
  );
}
