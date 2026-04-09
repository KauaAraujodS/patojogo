"use client";

import { useState } from "react";
import { AppMark } from "@/components/auth/app-mark";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/cn";

type Profile = {
  email: string | null;
  full_name: string | null;
  phone: string | null;
  progress_step: number | null;
  score: number | null;
};

type GameShellProps = {
  profile: Profile;
};

type TabId = "extras" | "shop" | "play" | "ranking" | "account";

const navItems: Array<{
  id: TabId;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    id: "extras",
    label: "Extras",
    icon: <SparkIcon />,
  },
  {
    id: "shop",
    label: "Loja",
    icon: <BagIcon />,
  },
  {
    id: "play",
    label: "Jogar",
    icon: <GamepadIcon />,
  },
  {
    id: "ranking",
    label: "Ranking",
    icon: <CupIcon />,
  },
  {
    id: "account",
    label: "Conta",
    icon: <UserIcon />,
  },
];

const playModes = [
  {
    accent: "from-[#2c7dff] via-[#1e54ff] to-[#1832ca]",
    description:
      "Siga a trilha principal da palestra e avance com perguntas mais guiadas.",
    icon: <StackIcon />,
    iconSurface: "bg-[linear-gradient(180deg,#7ad1ff,#3f7dff)]",
    title: "Quiz guiado",
  },
  {
    accent: "from-[#8d2dff] via-[#b61dff] to-[#d53cff]",
    description:
      "Entre numa rodada curta, mais intensa e com foco em pontuação rápida.",
    icon: <LightningSwordsIcon />,
    iconSurface: "bg-[linear-gradient(180deg,#f4a8ff,#9336ff)]",
    title: "Desafio relampago",
  },
];

export function GameShell({ profile }: GameShellProps) {
  const [activeTab, setActiveTab] = useState<TabId>("play");
  const activeItem = navItems.find((item) => item.id === activeTab) ?? navItems[2];
  const firstName = profile.full_name?.split(" ")[0] ?? "Participante";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(103,141,255,0.24),transparent_22%),linear-gradient(180deg,#1e2f83_0%,#223da9_54%,#202a87_100%)] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[31rem] flex-col px-4 py-4">
        <header className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-white/10 bg-[#12205b]/50 px-4 py-3 shadow-[0_18px_45px_rgba(7,12,40,0.32)] backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <div className="scale-[0.62]">
              <AppMark />
            </div>
            <div className="min-w-0">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#a7bcff]">
                PatoJOGO
              </p>
              <p className="truncate text-sm text-white/92">Ola, {firstName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-semibold text-[#ffe18a]">
              {profile.score ?? 0} pts
            </div>
            <SignOutButton
              className="min-h-9 rounded-full border-white/10 bg-white/8 px-3 text-xs text-white hover:bg-white/12"
              label="Sair"
              size="sm"
              variant="ghost"
            />
          </div>
        </header>

        <main className="flex-1 pt-5">
          {activeTab === "play" ? (
            <PlayHub progressStep={profile.progress_step ?? 0} />
          ) : (
            <BlankTab label={activeItem.label} />
          )}
        </main>

        <nav className="mt-5 grid grid-cols-5 gap-2 rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(134,27,214,0.94),rgba(81,28,160,0.94))] p-2 shadow-[0_28px_60px_rgba(20,6,53,0.34)]">
          {navItems.map((item) => {
            const isActive = item.id === activeTab;

            return (
              <button
                key={item.id}
                className={cn(
                  "flex min-h-[4.75rem] flex-col items-center justify-center gap-2 rounded-[1.15rem] border border-transparent px-2 py-3 text-[0.72rem] font-medium text-[#d9d0ff] transition-all",
                  isActive
                    ? "border-[#f0b23a] bg-white/10 text-[#ffd95b] shadow-[inset_0_0_0_1px_rgba(255,190,54,0.18)]"
                    : "hover:bg-white/6",
                )}
                onClick={() => setActiveTab(item.id)}
                type="button"
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center text-current",
                    isActive && "scale-105",
                  )}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function PlayHub({ progressStep }: { progressStep: number }) {
  return (
    <section className="space-y-4">
      <div className="rounded-[2rem] bg-[linear-gradient(135deg,#5b42ff_0%,#8d2dff_48%,#c017ff_100%)] px-6 py-7 text-center shadow-[0_28px_60px_rgba(35,13,85,0.3)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/14">
          <GamepadIcon />
        </div>
        <h1 className="mt-4 text-[2.25rem] font-semibold tracking-tight text-white">
          Jogar
        </h1>
        <p className="mt-2 text-sm text-[#ece6ff]">
          Escolha como quer pontuar na sua proxima rodada.
        </p>
      </div>

      <div className="space-y-4">
        {playModes.map((mode) => (
          <button
            key={mode.title}
            className={cn(
              "flex w-full items-center gap-4 rounded-[1.85rem] border border-white/18 bg-[linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02))] px-5 py-5 text-left shadow-[0_24px_50px_rgba(10,14,45,0.2)] backdrop-blur",
              `bg-gradient-to-r ${mode.accent}`,
            )}
            type="button"
          >
            <div
              className={cn(
                "flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.2rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]",
                mode.iconSurface,
              )}
            >
              {mode.icon}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-[1.55rem] font-semibold tracking-tight text-white">
                {mode.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-white/84">
                {mode.description}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/12 text-white">
              <ArrowIcon />
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-[1.35rem] border border-white/10 bg-[#161f43]/82 px-4 py-4 text-center text-sm text-[#d8e0ff] shadow-[0_16px_36px_rgba(8,12,34,0.24)]">
        <span className="font-semibold text-[#ffd261]">Etapa {progressStep}</span>
        {" "}salva. Toda resposta boa sobe sua pontuacao no ranking final.
      </div>
    </section>
  );
}

function BlankTab({ label }: { label: string }) {
  return (
    <section className="flex min-h-[34rem] flex-col rounded-[2rem] border border-white/10 bg-[#12225a]/24 p-5 shadow-[0_24px_48px_rgba(7,12,40,0.22)]">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#8da6ff]">
        {label}
      </p>
      <div className="mt-4 flex flex-1 rounded-[1.6rem] border border-dashed border-white/10 bg-white/[0.03]" />
    </section>
  );
}

function iconProps() {
  return {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" {...iconProps()}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" {...iconProps()}>
      <path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7z" />
      <path d="M5 16.5 6 19l2.5 1-2.5 1L5 23l-1-2.5L1.5 19 4 18z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" {...iconProps()}>
      <path d="M5 8h14l-1 11H6L5 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

function GamepadIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" {...iconProps()}>
      <path d="M7.5 9h9A4.5 4.5 0 0 1 21 13.5v1a3.5 3.5 0 0 1-6 2.4L13.8 16h-3.6L9 16.9a3.5 3.5 0 0 1-6-2.4v-1A4.5 4.5 0 0 1 7.5 9Z" />
      <path d="M8 12v4" />
      <path d="M6 14h4" />
      <path d="M15.5 12h.01" />
      <path d="M18 14h.01" />
    </svg>
  );
}

function CupIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" {...iconProps()}>
      <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" />
      <path d="M6 5H4a2 2 0 0 0 2 3" />
      <path d="M18 5h2a2 2 0 0 1-2 3" />
      <path d="M12 11v4" />
      <path d="M8 19h8" />
      <path d="M9.5 15h5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" {...iconProps()}>
      <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-8 text-white"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M7 5h10v10H7z" />
      <path d="M4 8h10v10H4z" />
      <path d="M10 11h10v10H10z" />
    </svg>
  );
}

function LightningSwordsIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-8 text-white"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="m7 4 4 4-5 9-3-3 9-5 4 4" />
      <path d="m17 4-4 4 5 9 3-3-9-5-4 4" />
    </svg>
  );
}
