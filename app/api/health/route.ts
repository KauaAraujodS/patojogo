import { hasSupabaseEnv } from "@/lib/env";

export async function GET() {
  return Response.json({
    ok: true,
    app: process.env.NEXT_PUBLIC_APP_NAME ?? "Pato Jogo",
    supabaseConfigured: hasSupabaseEnv(),
    timestamp: new Date().toISOString(),
  });
}
