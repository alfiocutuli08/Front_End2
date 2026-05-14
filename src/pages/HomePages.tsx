import {
  Search,
  Bell,
  MessageCircle,
  MapPin,
  Star,
  ArrowRight,
} from "lucide-react";

export default function HomePages() {
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
      {/* NAVBAR */}
      <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center font-bold text-black">
              S
            </div>

            <div>
              <h1 className="text-xl font-bold text-orange-500">
                SkillSwap
              </h1>

              <p className="text-xs text-zinc-500">
                Scambio competenze
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              type="text"
              placeholder="Cerca skill, utenti o tecnologie..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <button className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-orange-500 transition">
              <Bell size={18} />
            </button>

            <button className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-orange-500 transition">
              <MessageCircle size={18} />
            </button>

            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-orange-500">
              <img
                src="https://i.pravatar.cc/300?img=12"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="bg-zinc-950 border border-orange-500 rounded-3xl p-8 shadow-[0_0_30px_rgba(249,115,22,0.12)]">
            <p className="text-orange-500 text-sm font-medium mb-4">
              Marketplace interno competenze
            </p>

            <h2 className="text-5xl font-bold leading-tight">
              Impara.
              <br />
              Insegna.
              <br />
              Connettiti.
            </h2>

            <p className="text-zinc-400 mt-6 max-w-xl leading-relaxed">
              Trova colleghi compatibili con le tue skill, organizza
              sessioni di scambio 1:1 e migliora le tue competenze.
            </p>

            <div className="flex gap-4 mt-8">
              <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-2xl font-medium transition">
                Inizia ora
              </button>

              <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-orange-500 rounded-2xl font-medium transition">
                Cerca utenti
              </button>
            </div>
          </div>

          {/* RIGHT STATS */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
              <p className="text-zinc-500 text-sm">
                Utenti attivi
              </p>

              <h3 className="text-4xl font-bold mt-3 text-orange-500">
                240+
              </h3>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
              <p className="text-zinc-500 text-sm">
                Sessioni completate
              </p>

              <h3 className="text-4xl font-bold mt-3 text-orange-500">
                1.2K
              </h3>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
              <p className="text-zinc-500 text-sm">
                Skill disponibili
              </p>

              <h3 className="text-4xl font-bold mt-3 text-orange-500">
                95+
              </h3>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
              <p className="text-zinc-500 text-sm">
                Rating medio
              </p>

              <h3 className="text-4xl font-bold mt-3 text-orange-500">
                4.9
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* USER SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-3xl font-bold">
              Match consigliati
            </h3>

            <p className="text-zinc-500 mt-1">
              Colleghi compatibili con le tue skill
            </p>
          </div>

          <button className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition">
            Vedi tutti
            <ArrowRight size={16} />
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {utenti.map((utente) => (
            <div
              key={utente.nome}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 hover:border-orange-500 transition duration-300"
            >
              {/* TOP */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-500">
                  <img
                    src={utente.img}
                    alt={utente.nome}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="text-xl font-semibold">
                    {utente.nome}
                  </h4>

                  <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                    <MapPin
                      size={14}
                      className="text-orange-500"
                    />
                    <span>{utente.citta}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Star
                        size={14}
                        fill="currentColor"
                      />
                      {utente.rating}
                    </div>

                    <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">
                      {utente.livello}
                    </span>
                  </div>
                </div>
              </div>

              {/* OFFERTE */}
              <div className="mt-6">
                <p className="text-sm text-zinc-500 mb-3">
                  Skill offerte
                </p>

                <div className="flex flex-wrap gap-2">
                  {utente.offerte.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* CERCATE */}
              <div className="mt-5">
                <p className="text-sm text-zinc-500 mb-3">
                  Skill cercate
                </p>

                <div className="flex flex-wrap gap-2">
                  {utente.cercate.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* BUTTON */}
              <button className="w-full mt-7 py-3 bg-orange-500 hover:bg-orange-600 rounded-2xl font-medium transition">
                Visualizza profilo
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}