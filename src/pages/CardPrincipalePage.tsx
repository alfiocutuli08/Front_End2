import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router";
import type { Match } from "@/lib/types";

export function CardPrincipalePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = (location.state as { profile: Match & { description?: string } })?.profile;

  const name = profile?.name ?? "Luca Bianchi";
  const image = profile?.image_url || "https://cdn.phototourl.com/free/2026-05-12-bac6185b-c4fb-44db-bc6e-99673f2d71cd.jpg";
  const locationText = profile?.location ?? "Milano, Italia";
  const description = profile?.description ?? "Sviluppatore Frontend con esperienza in React e Next.js.";
  const offeredSkills = profile?.offerte ?? ["React", "TypeScript", "Next.js"];
  const requestedSkills = profile?.cercate ?? ["Node.js", "Docker"];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),_transparent_28%),linear-gradient(180deg,_#0b0b0b_0%,_#050505_100%)] px-4 py-8 sm:px-8 lg:px-14">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl items-center justify-center rounded-[32px] border border-orange-500/15 bg-zinc-950/30 p-6 backdrop-blur-sm sm:p-10 relative">
        <button
          onClick={() => window.history.back()}
          className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          Indietro
        </button>
        <Card className="w-full max-w-[420px] rounded-[32px] border border-orange-500/60 bg-zinc-950 text-white shadow-[0_0_0_1px_rgba(249,115,22,0.12),0_18px_60px_rgba(0,0,0,0.55)]">
          <CardContent className="p-6">
            <div className="rounded-[26px] border border-orange-500/20 bg-zinc-950/80 p-6">
            <div className="relative h-22 w-22">
              <img
                src={image}
                alt={`Foto profilo di ${name}`}
                className="h-22 w-22 rounded-full object-cover shadow-inner"
              />
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-zinc-950 bg-emerald-500" />
            </div>

            <div className="mt-5">
              <h1 className="m-0 max-w-[280px] text-[2rem] leading-tight font-semibold tracking-[-0.03em] text-white sm:text-[2.2rem]">
                {name}
              </h1>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-zinc-400">
                <MapPin className="h-4 w-4 text-zinc-500" />
                <span>{locationText}</span>
              </div>
              <p className="mt-4 max-w-[250px] text-sm leading-7 text-zinc-400">
                {description}
              </p>
            </div>

            <div className="mt-6 border-t border-zinc-800 pt-5">
              <h2 className="text-lg font-semibold text-white">Offre</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {offeredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl border border-emerald-500/20 bg-emerald-950/70 px-3 py-1.5 text-sm font-medium text-emerald-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <h2 className="text-lg font-semibold text-white">Cerca</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {requestedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl border border-indigo-500/20 bg-indigo-950/70 px-3 py-1.5 text-sm font-medium text-indigo-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <Button
              onClick={() => {
                navigate("/public", { state: { profile } });
              }}
              className="mt-8 h-12 w-full rounded-xl border border-orange-500 bg-transparent text-base font-semibold text-orange-400 hover:bg-orange-500 hover:text-black"
              variant="outline"
            >
              Vedi profilo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}