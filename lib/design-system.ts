export const designSystem = {
  color: {
    background: "bg-background",
    foreground: "text-foreground",
    surface: "bg-surface",
    surfaceStrong: "bg-surface-strong",
    border: "border-panel-border",
    accent: "bg-accent text-white",
    accentText: "text-accent-strong",
    mutedText: "text-muted",
  },
  radius: {
    pill: "rounded-full",
    button: "rounded-[1rem]",
    card: "rounded-[1.75rem]",
    hero: "rounded-[2rem]",
  },
  shadow: {
    soft: "shadow-[0_18px_45px_rgba(76,51,22,0.08)]",
    card: "shadow-[0_30px_80px_rgba(85,56,22,0.08)]",
  },
  typography: {
    eyebrow:
      "text-xs font-semibold uppercase tracking-[0.3em] text-accent-strong",
    display:
      "text-4xl font-semibold tracking-tight md:text-6xl text-foreground",
    pageTitle:
      "text-3xl font-semibold tracking-tight md:text-5xl text-foreground",
    sectionTitle:
      "text-sm font-semibold uppercase tracking-[0.28em] text-muted",
    lead: "text-base leading-7 text-muted md:text-lg",
    body: "text-sm leading-7 text-muted md:text-base",
    caption: "text-xs font-medium uppercase tracking-[0.22em] text-muted",
  },
  button: {
    base: "inline-flex items-center justify-center gap-2 rounded-[1rem] border px-4 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:pointer-events-none disabled:opacity-60",
    variants: {
      primary:
        "border-accent bg-accent text-white hover:bg-accent-strong hover:border-accent-strong",
      secondary:
        "border-panel-border bg-surface-strong text-foreground hover:bg-white",
      ghost: "border-transparent bg-transparent text-foreground hover:bg-black/5",
    },
    sizes: {
      sm: "min-h-10 px-3 py-2 text-sm",
      md: "min-h-11 px-4 py-3 text-sm",
      lg: "min-h-12 px-5 py-3.5 text-base",
    },
  },
  input: {
    base: "flex min-h-12 w-full rounded-[1rem] border border-border-strong/70 bg-surface-strong px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20",
    label: "text-sm font-semibold text-foreground",
    hint: "text-xs leading-6 text-muted",
  },
} as const;

export type ButtonVariant = keyof typeof designSystem.button.variants;
export type ButtonSize = keyof typeof designSystem.button.sizes;
