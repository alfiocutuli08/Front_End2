import { useNavigate } from "react-router";
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
} from "lucide-react";

export default function HomePages() {
  const navigate = useNavigate();
  const utenti = [
    {
      nome: "Luca Bianchi",
      citta: "Milano, Italia",
      livello: "Avanzato",
      rating: "4.9",
      offerte: ["React", "TypeScript", "UI Design"],
      cercate: ["Docker", "Node.js"],
      img: "https://i.pravatar.cc/300?img=12",
    },
    {
      nome: "Marco Rossi",
      citta: "Roma, Italia",
      livello: "Intermedio",
      rating: "4.7",
      offerte: ["Python", "FastAPI", "SQLAlchemy"],
      cercate: ["React", "Tailwind"],
      img: "https://i.pravatar.cc/300?img=15",
    },
    {
      nome: "Giulia Verdi",
      citta: "Torino, Italia",
      livello: "Avanzato",
      rating: "5.0",
      offerte: ["Figma", "UX Design", "Tailwind"],
      cercate: ["PostgreSQL", "Backend"],
      img: "https://i.pravatar.cc/300?img=32",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* SFONDO CON GRADIENTE */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/5 blur-[100px]" />
      </div>

      {/* NAVBAR */}
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
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Cerca skill, utenti o tecnologie..."
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-11 h-11 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 hover:shadow-lg hover:shadow-orange-500/10 transition-all"
            >
              <Bell size={18} />
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-11 h-11 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 hover:shadow-lg hover:shadow-orange-500/10 transition-all"
            >
              <MessageCircle size={18} />
            </button>
            <button onClick={() => navigate("/profilo")} className="w-11 h-11 rounded-full overflow-hidden border-2 border-orange-500 ring-2 ring-orange-500/20 hover:ring-orange-500/40 transition-all">
              <img
                src="https://i.pravatar.cc/300?img=12"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-950/60 border border-orange-500/30 rounded-3xl p-10 backdrop-blur-sm shadow-[0_0_40px_rgba(249,115,22,0.1)] relative overflow-hidden group hover:shadow-[0_0_60px_rgba(249,115,22,0.2)] transition-shadow duration-500">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <Sparkles size={20} className="text-orange-500 mb-4" />
            <p className="text-orange-400 text-sm font-medium mb-4 tracking-wider uppercase">
              Marketplace interno competenze
            </p>
            <h2 className="text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
                Impara.
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-white bg-clip-text text-transparent">
                Insegna.
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Connettiti.
              </span>
            </h2>
            <p className="text-zinc-400 mt-6 max-w-xl leading-relaxed">
              Trova colleghi compatibili con le tue skill, organizza
              sessioni di scambio 1:1 e migliora le tue competenze.
            </p>
            <div className="flex gap-4 mt-10">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-2xl font-medium transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                Inizia ora
              </button>
              <button
                onClick={() => navigate("/search")}
                className="px-8 py-3.5 bg-zinc-900/80 border border-zinc-700 hover:border-orange-500 rounded-2xl font-medium transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Cerca utenti
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, value: "240+", label: "Utenti attivi", delay: "0" },
              { icon: TrendingUp, value: "1.2K", label: "Sessioni completate", delay: "100" },
              { icon: BookOpen, value: "95+", label: "Skill disponibili", delay: "200" },
              { icon: Star, value: "4.9", label: "Rating medio", delay: "300" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/5"
              >
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

      {/* USER SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-orange-500" />
              <h3 className="text-3xl font-bold">Match consigliati</h3>
            </div>
            <p className="text-zinc-500">Colleghi compatibili con le tue skill</p>
          </div>
          <button
            onClick={() => navigate("/search")}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-all group"
          >
            Vedi tutti
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {utenti.map((utente) => (
            <div
              key={utente.nome}
              className="group bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-start gap-4 relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-500 ring-2 ring-orange-500/20 shrink-0">
                  <img
                    src={utente.img}
                    alt={utente.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl font-semibold truncate">
                    {utente.nome}
                  </h4>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                    <MapPin size={14} className="text-orange-500 shrink-0" />
                    <span className="truncate">{utente.citta}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Star size={14} fill="currentColor" />
                      {utente.rating}
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/20">
                      {utente.livello}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 relative">
                <p className="text-sm text-zinc-500 mb-3">Skill offerte</p>
                <div className="flex flex-wrap gap-2">
                  {utente.offerte.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-green-900/40 to-green-800/20 text-green-400 text-xs border border-green-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 relative">
                <p className="text-sm text-zinc-500 mb-3">Skill cercate</p>
                <div className="flex flex-wrap gap-2">
                  {utente.cercate.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-900/40 to-blue-800/20 text-blue-400 text-xs border border-blue-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate("/card")}
                className="w-full mt-7 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-2xl font-medium transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 relative"
              >
                Visualizza profilo
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
