import { AuthPanel } from "@/components/auth/auth-panel";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { AppMark } from "@/components/auth/app-mark";
import { Button } from "@/components/ui/button";
import {
  BodyText,
  Caption,
  Eyebrow,
  Lead,
  PageTitle,
  SectionTitle,
} from "@/components/ui/typography";
import type { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

type Profile = Pick<
  Tables<"profiles">,
  "email" | "full_name" | "phone" | "progress_step" | "score"
>;

function SignedInCard({ profile }: { profile: Profile }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#2f469b_0%,#4b299f_46%,#6a1db3_100%)] px-4 py-7">
      <div className="w-full max-w-[28rem] rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(70,46,179,0.9),rgba(80,25,148,0.95))] p-5 shadow-[0_30px_70px_rgba(18,8,56,0.35)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AppMark />
            <div>
              <Caption className="text-[#d9e0ff]">PatoJOGO</Caption>
              <SectionTitle className="mt-1 text-white">
                Sessao ativa
              </SectionTitle>
            </div>
          </div>

          <SignOutButton />
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-[#211038] p-5 text-stone-100">
          <Eyebrow className="text-[#d9e0ff]">Participante</Eyebrow>
          <PageTitle className="mt-2 text-3xl text-white md:text-4xl">
            {profile.full_name}
          </PageTitle>
          <Lead className="mt-3 max-w-sm text-[#d0c4f0]">
            Seu progresso está salvo e sua pontuação já pode entrar no ranking
            final da palestra.
          </Lead>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-[1rem] bg-white/8 p-4">
              <Caption className="text-[#d9e0ff]">Etapa atual</Caption>
              <p className="mt-2 text-2xl font-semibold text-white">
                {profile.progress_step}
              </p>
            </div>
            <div className="rounded-[1rem] bg-white/8 p-4">
              <Caption className="text-[#d9e0ff]">Pontuacao</Caption>
              <p className="mt-2 text-2xl font-semibold text-white">
                {profile.score}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="rounded-[1rem] border border-white/10 bg-[#3148d0]/30 p-4">
            <Caption className="text-[#d9e0ff]">Email</Caption>
            <BodyText className="mt-2 text-white">{profile.email}</BodyText>
          </div>
          <div className="rounded-[1rem] border border-white/10 bg-[#3148d0]/30 p-4">
            <Caption className="text-[#d9e0ff]">Telefone</Caption>
            <BodyText className="mt-2 text-white">{profile.phone}</BodyText>
          </div>
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-[#4a23a0]/50 p-5">
          <Caption className="text-[#d9e0ff]">Proxima acao</Caption>
          <BodyText className="mt-2 text-[#f2ebff]">
            Entre na próxima etapa da palestra e continue acumulando pontos para
            disputar o brinde.
          </BodyText>
          <Button
            className="mt-4 w-full border-[#ff9d0a] bg-[linear-gradient(90deg,#ffc312,#ff7c0f)] text-[#201208] hover:border-[#ff9d0a] hover:bg-[linear-gradient(90deg,#ffc312,#ff7c0f)]"
            size="lg"
          >
            Continuar no jogo
          </Button>
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
    <main>{!profile ? <AuthPanel /> : <SignedInCard profile={profile} />}</main>
  );
}
