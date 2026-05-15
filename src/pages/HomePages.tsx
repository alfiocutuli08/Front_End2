import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  MessageCircle,
  MapPin,
  Star,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  BookOpen,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { statsService, requestService, searchService } from "@/lib/services";
import type { Stats, Match } from "@/lib/types";

export default function HomePages() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState<Stats | null>(null);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    statsService.getHomeStats().then(({ data }) => setStats(data)).catch(() => {});
    searchService.getMatches().then(({ data }) => {
      const mapped: Match[] = data.map((u: any) => ({
        id: u.id,
        name: u.name,
        location: u.location,
        offerte: (u.offered_skills || []).map((s: any) => s.skill_name),
        cercate: (u.wanted_skills || []).map((s: any) => s.skill_name),
        image_url: `https://i.pravatar.cc/300?img=${(u.id % 70) + 1}`,
        rating: undefined,
        level: undefined,
      }));
      setMatches(mapped.length > 0 ? mapped : null);
    }).catch(() => {});
    if (user) {
      requestService.getPendingRequests().then(({ data }) => setPendingCount(data.pending_count)).catch(() => {});
    }
  }, [user]);

  const displayUsers = matches ?? [
    { name: "Luca Bianchi", location: "Milano, Italia", level: "Avanzato", rating: 4.9, offerte: ["React", "TypeScript", "UI Design"], cercate: ["Docker", "Node.js"], image_url: "https://i.pravatar.cc/300?img=12" },
    { name: "Marco Rossi", location: "Roma, Italia", level: "Intermedio", rating: 4.7, offerte: ["Python", "FastAPI", "SQLAlchemy"], cercate: ["React", "Tailwind"], image_url: "https://i.pravatar.cc/300?img=15" },
    { name: "Giulia Verdi", location: "Torino, Italia", level: "Avanzato", rating: 5.0, offerte: ["Figma", "UX Design", "Tailwind"], cercate: ["PostgreSQL", "Backend"], image_url: "https://i.pravatar.cc/300?img=32" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/5 blur-[100px]" />
      </div>

      <header className="relative border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-black shadow-lg shadow-orange-500/25">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                SkillSwap
              </h1>
              <p className="text-xs text-zinc-500">Scambio competenze</p>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-2xl relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
            <input type="text" placeholder="Cerca skill, utenti o tecnologie..." className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all" />
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button onClick={() => navigate("/richieste")} className="relative w-11 h-11 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 hover:shadow-lg hover:shadow-orange-500/10 transition-all">
                  <Bell size={18} />
                  {pendingCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px]">
                      {pendingCount}
                    </span>
                  )}
                </button>
                <button onClick={() => navigate("/richieste")} className="relative w-11 h-11 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 hover:shadow-lg hover:shadow-orange-500/10 transition-all">
                  <MessageCircle size={18} />
                </button>
                <button onClick={() => navigate("/profile")} className="w-11 h-11 rounded-full overflow-hidden border-2 border-orange-500 ring-2 ring-orange-500/20 hover:ring-orange-500/40 transition-all">
                  <img src="https://i.pravatar.cc/300?img=12" alt="profile" className="w-full h-full object-cover" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/login")} className="px-4 py-2 text-sm bg-zinc-900/80 border border-zinc-700 hover:border-orange-500 rounded-xl transition-all flex items-center gap-2">
                  <LogIn size={16} /> Accedi
                </button>
                <button onClick={() => navigate("/register")} className="px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 rounded-xl transition-all flex items-center gap-2">
                  <UserPlus size={16} /> Registrati
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-950/60 border border-orange-500/30 rounded-3xl p-10 backdrop-blur-sm shadow-[0_0_40px_rgba(249,115,22,0.1)] relative overflow-hidden group hover:shadow-[0_0_60px_rgba(249,115,22,0.2)] transition-shadow duration-500">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <Sparkles size={20} className="text-orange-500 mb-4" />
            <p className="text-orange-400 text-sm font-medium mb-4 tracking-wider uppercase">Marketplace interno competenze</p>
            <h2 className="text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">Impara.</span><br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-white bg-clip-text text-transparent">Insegna.</span><br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Connettiti.</span>
            </h2>
            <p className="text-zinc-400 mt-6 max-w-xl leading-relaxed">Trova colleghi compatibili con le tue skill, organizza sessioni di scambio 1:1 e migliora le tue competenze.</p>
            <div className="flex gap-4 mt-10">
              <button onClick={() => navigate("/register")} className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-2xl font-medium transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0">
                Inizia ora
              </button>
              <button onClick={() => navigate("/search")} className="px-8 py-3.5 bg-zinc-900/80 border border-zinc-700 hover:border-orange-500 rounded-2xl font-medium transition-all hover:-translate-y-0.5 active:translate-y-0">
                Cerca utenti
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, value: stats ? `${stats.total_users}+` : "...", label: "Utenti attivi" },
              { icon: TrendingUp, value: stats ? `${stats.total_matches}` : "...", label: "Sessioni completate" },
              { icon: BookOpen, value: stats ? `${stats.total_skills}+` : "...", label: "Skill disponibili" },
              { icon: Star, value: stats ? `${((stats.total_matches / Math.max(stats.total_users, 1)) * 5).toFixed(1)}` : "...", label: "Rating medio" },
            ].map((stat) => (
              <div key={stat.label} className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/5">
                <stat.icon size={20} className="text-orange-500 mb-3" />
                <p className="text-zinc-500 text-sm">{stat.label}</p>
                <h3 className="text-3xl font-bold mt-1 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  {stat.value}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-orange-500" />
              <h3 className="text-3xl font-bold">Match consigliati</h3>
            </div>
            <p className="text-zinc-500">Colleghi compatibili con le tue skill</p>
          </div>
          <button onClick={() => navigate("/search")} className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-all group">
            Vedi tutti <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayUsers.map((utente, idx) => (
            <div key={utente.name + idx} className="group bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-start gap-4 relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-500 ring-2 ring-orange-500/20 shrink-0">
                  <img src={(utente as any).image_url || `https://i.pravatar.cc/300?img=${idx + 12}`} alt={utente.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl font-semibold truncate">{utente.name}</h4>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                    <MapPin size={14} className="text-orange-500 shrink-0" />
                    <span className="truncate">{utente.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {utente.rating && (
                      <>
                        <div className="flex items-center gap-1 text-yellow-400 text-sm">
                          <Star size={14} fill="currentColor" />
                          {utente.rating}
                        </div>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/20">
                          {(utente as any).level || "Intermedio"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 relative">
                <p className="text-sm text-zinc-500 mb-3">Skill offerte</p>
                <div className="flex flex-wrap gap-2">
                  {utente.offerte.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-gradient-to-r from-green-900/40 to-green-800/20 text-green-400 text-xs border border-green-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 relative">
                <p className="text-sm text-zinc-500 mb-3">Skill cercate</p>
                <div className="flex flex-wrap gap-2">
                  {utente.cercate.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-900/40 to-blue-800/20 text-blue-400 text-xs border border-blue-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button onClick={() => navigate("/card", { state: { profile: utente } })} className="w-full mt-7 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-2xl font-medium transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 relative">
                Visualizza profilo
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
