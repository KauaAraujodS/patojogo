"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { AppMark } from "@/components/auth/app-mark";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type Mode = "sign-in" | "sign-up";

function normalizePhone(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function formatPhone(value: string) {
  const digits = normalizePhone(value);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const supabase = createClient();
    const normalizedPhone = normalizePhone(phone);

    if (!email || !password) {
      setError("Preencha email e senha.");
      return;
    }

    if (mode === "sign-up") {
      if (!fullName.trim()) {
        setError("Informe seu nome.");
        return;
      }

      if (normalizedPhone.length < 10) {
        setError("Informe um telefone valido.");
        return;
      }
    }

    setIsPending(true);

    if (mode === "sign-up") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: normalizedPhone,
          },
        },
      });

      setIsPending(false);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        startTransition(() => {
          router.refresh();
        });
        return;
      }

      setSuccess("Conta criada. Agora faça seu login para entrar no PatoJOGO.");
      setMode("sign-in");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsPending(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[linear-gradient(180deg,#2f469b_0%,#4b299f_46%,#6a1db3_100%)] px-4 py-7">
      <div className="w-full max-w-[28rem]">
        <div className="px-3 pb-6 pt-2 text-center text-white">
          <AppMark />
          <h1 className="mt-2 text-[2.2rem] font-medium tracking-tight text-[#ffbb20]">
            PatoJOGO
          </h1>
          <p className="mt-2 text-base text-[#d7e4ff]">
            Aprenda, salve seu progresso e dispute o ranking final.
          </p>
        </div>

        <div className="rounded-[1.7rem] border border-[#a16b8a] bg-[linear-gradient(180deg,rgba(74,46,181,0.82),rgba(98,29,179,0.9))] p-4 shadow-[0_28px_60px_rgba(22,10,63,0.34)] backdrop-blur">
          <div className="flex gap-2 rounded-[1.1rem]">
            <button
              className={[
                "min-h-11 flex-1 rounded-[0.9rem] border px-4 text-sm font-semibold transition-colors",
                mode === "sign-in"
                  ? "border-[#ff9d0a] bg-[linear-gradient(90deg,#ffbf12,#ff7c0f)] text-[#24140a]"
                  : "border-[#3f7bff] bg-[#3148d0] text-[#dce5ff]",
              ].join(" ")}
              onClick={() => setMode("sign-in")}
              type="button"
            >
              Login
            </button>
            <button
              className={[
                "min-h-11 flex-1 rounded-[0.9rem] border px-4 text-sm font-semibold transition-colors",
                mode === "sign-up"
                  ? "border-[#ff9d0a] bg-[linear-gradient(90deg,#ffbf12,#ff7c0f)] text-[#24140a]"
                  : "border-[#3f7bff] bg-[#3148d0] text-[#dce5ff]",
              ].join(" ")}
              onClick={() => setMode("sign-up")}
              type="button"
            >
              Cadastro
            </button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {mode === "sign-up" ? (
              <>
                <Field
                  label="Nome completo"
                  labelClassName="text-white"
                >
                  <Input
                    className="min-h-[3.35rem] border-[#2e84ff] bg-[#2b4cb8]/55 text-[#eef4ff] placeholder:text-[#a9c0ff] focus:border-[#4db2ff] focus:ring-[#4db2ff]/25"
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Digite seu nome"
                    value={fullName}
                  />
                </Field>

                <Field
                  hint="Use o telefone para contato e entrega do brinde."
                  hintClassName="text-[#c8d5ff]"
                  label="Telefone"
                  labelClassName="text-white"
                >
                  <Input
                    autoComplete="tel"
                    className="min-h-[3.35rem] border-[#2e84ff] bg-[#2b4cb8]/55 text-[#eef4ff] placeholder:text-[#a9c0ff] focus:border-[#4db2ff] focus:ring-[#4db2ff]/25"
                    inputMode="tel"
                    onChange={(event) => setPhone(formatPhone(event.target.value))}
                    placeholder="(11) 99999-9999"
                    value={phone}
                  />
                </Field>
              </>
            ) : null}

            <Field label="Email" labelClassName="text-white">
              <Input
                autoComplete="email"
                className="min-h-[3.35rem] border-[#2e84ff] bg-[#2b4cb8]/55 text-[#eef4ff] placeholder:text-[#a9c0ff] focus:border-[#4db2ff] focus:ring-[#4db2ff]/25"
                onChange={(event) => setEmail(event.target.value)}
                placeholder={mode === "sign-in" ? "Digite seu email" : "voce@email.com"}
                type="email"
                value={email}
              />
            </Field>

            <Field label="Senha" labelClassName="text-white">
              <Input
                autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                className="min-h-[3.35rem] border-[#2e84ff] bg-[#2b4cb8]/55 text-[#eef4ff] placeholder:text-[#a9c0ff] focus:border-[#4db2ff] focus:ring-[#4db2ff]/25"
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Sua senha"
                type="password"
                value={password}
              />
            </Field>

            {error ? (
              <div className="rounded-[0.95rem] border border-[#ffb066]/30 bg-[#ff9d0a]/12 px-4 py-3 text-sm text-[#ffd9b0]">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-[0.95rem] border border-[#9effc8]/20 bg-[#1dd377]/14 px-4 py-3 text-sm text-[#d9ffe9]">
                {success}
              </div>
            ) : null}

            <Button
              className="min-h-[3.45rem] w-full border-[#ff9d0a] bg-[linear-gradient(90deg,#ffc312,#ff7c0f)] text-base font-semibold text-[#201208] hover:border-[#ff9d0a] hover:bg-[linear-gradient(90deg,#ffc312,#ff7c0f)]"
              disabled={isPending}
              size="lg"
              type="submit"
            >
              {isPending
                ? "Processando..."
                : mode === "sign-up"
                  ? "Criar conta"
                  : "Entrar"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-[#d8dfff]">
            {mode === "sign-in" ? "Nao tem uma conta? " : "Ja tem uma conta? "}
            <button
              className="font-semibold text-[#ffbe1a] underline underline-offset-3"
              onClick={() =>
                setMode((current) =>
                  current === "sign-in" ? "sign-up" : "sign-in",
                )
              }
              type="button"
            >
              {mode === "sign-in" ? "Cadastre-se" : "Entrar"}
            </button>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-[#9fd6ff]">
          <span>Salve seu progresso</span>
          <span>•</span>
          <span>Dispute o ranking</span>
          <span>•</span>
          <span>Ganhe o brinde</span>
        </div>
      </div>
    </div>
  );
}
