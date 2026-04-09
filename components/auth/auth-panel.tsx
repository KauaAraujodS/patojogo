"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import {
  BodyText,
  Caption,
  SectionTitle,
} from "@/components/ui/typography";
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
  const [mode, setMode] = useState<Mode>("sign-up");
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

      setSuccess(
        "Conta criada. Se o projeto exigir confirmacao de email, confira sua caixa de entrada antes de entrar.",
      );
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
    <div className="rounded-[var(--radius-card)] border border-panel-border bg-surface p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-3">
        <SectionTitle as="h2">Acesso do participante</SectionTitle>
        <div className="flex rounded-full border border-panel-border bg-surface-strong p-1">
          <button
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              mode === "sign-up"
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground",
            ].join(" ")}
            onClick={() => setMode("sign-up")}
            type="button"
          >
            Cadastro
          </button>
          <button
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              mode === "sign-in"
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground",
            ].join(" ")}
            onClick={() => setMode("sign-in")}
            type="button"
          >
            Entrar
          </button>
        </div>
      </div>

      <BodyText className="mt-4">
        O participante cria a conta para salvar progresso, acompanhar a
        pontuacao e ver sua posicao no ranking ao final da palestra.
      </BodyText>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {mode === "sign-up" ? (
          <>
            <Field label="Nome completo">
              <Input
                autoComplete="name"
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Seu nome"
                value={fullName}
              />
            </Field>

            <Field label="Telefone" hint="Use seu WhatsApp para contato e brinde.">
              <Input
                autoComplete="tel"
                inputMode="tel"
                onChange={(event) => setPhone(formatPhone(event.target.value))}
                placeholder="(11) 99999-9999"
                value={phone}
              />
            </Field>
          </>
        ) : null}

        <Field label="Email">
          <Input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@email.com"
            type="email"
            value={email}
          />
        </Field>

        <Field
          hint={mode === "sign-up" ? "Use uma senha que voce lembre no dia da palestra." : undefined}
          label="Senha"
        >
          <Input
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimo de 6 caracteres"
            type="password"
            value={password}
          />
        </Field>

        {error ? (
          <div className="rounded-[var(--radius-button)] border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-warning">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-[var(--radius-button)] border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
            {success}
          </div>
        ) : null}

        <Button className="w-full" disabled={isPending} size="lg" type="submit">
          {isPending
            ? "Processando..."
            : mode === "sign-up"
              ? "Criar conta e entrar"
              : "Entrar no app"}
        </Button>
      </form>

      <div className="mt-5 rounded-[var(--radius-button)] border border-panel-border bg-surface-strong px-4 py-3">
        <Caption>Dados captados nesta etapa</Caption>
        <BodyText className="mt-2">
          Nome, email e telefone ficam atrelados ao participante para salvar o
          progresso e liberar o ranking final da palestra.
        </BodyText>
      </div>
    </div>
  );
}
