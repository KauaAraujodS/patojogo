import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const levels = ["Iniciante", "Intermediario", "Avancado"] as const;

export default async function QuizGuiadoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,rgba(103,141,255,0.24),transparent_22%),linear-gradient(180deg,#1e2f83_0%,#223da9_54%,#202a87_100%)] px-4 text-white">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[28rem] items-center justify-center">
        <div className="grid w-full gap-4">
          {levels.map((level) => (
            <Button
              key={level}
              className="min-h-16 w-full rounded-[1.5rem] border-[#ffb327] bg-[linear-gradient(135deg,#5a39ff_0%,#8d2dff_52%,#c51bff_100%)] text-lg font-semibold text-white hover:border-[#ffb327] hover:bg-[linear-gradient(135deg,#5a39ff_0%,#8d2dff_52%,#c51bff_100%)]"
              size="lg"
            >
              {level}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
