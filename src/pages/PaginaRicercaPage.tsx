import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  FolderOpen,
  MapPin,
  Search,
  Settings,
  User,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/lib/AuthContext";
import { searchService } from "@/lib/services";
import type { Match } from "@/lib/types";

const fallbackProfiles: (Match & { description?: string })[] = [
  {
    id: 1,
    name: "Luca Bianchi",
    email: "luca@test.it",
    location: "Milano, Italia",
    description:
      "Sviluppatore Frontend con esperienza in React e Next.js. Appassionato di UI/UX e design system.",
    offerte: ["React", "TypeScript", "Next.js"],
    cercate: ["Node.js", "Docker"],
    level: "Avanzato",
  },
  {
    id: 2,
    name: "Giulia Verdi",
    email: "giulia@test.it",
    location: "Roma, Italia",
    description:
      "Designer con focus su UI/UX e design thinking. Mi piace creare esperienze utente chiare e utili.",
    offerte: ["UI Design", "Figma", "Prototipazione"],
    cercate: ["React", "JavaScript"],
    level: "Intermedio",
  },
  {
    id: 3,
    name: "Alessandro Neri",
    email: "alex@test.it",
    location: "Torino, Italia",
    description:
      "Backend developer orientato a prodotti solidi e API ben strutturate. Interesse forte per stack cloud.",
    offerte: ["Python", "Django", "SQL"],
    cercate: ["DevOps", "AWS"],
    level: "Avanzato",
  },
];

const menuItems = [
  { label: "Ricerca", icon: Search, active: true, path: "/search" },
  { label: "Richieste", icon: FolderOpen, active: false, path: "/richieste" },
  { label: "Profilo", icon: User, active: false, path: "/profile" },
  { label: "Impostazioni", icon: Settings, active: false, path: "/impostazioni" },
];

export function PaginaRicercaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showOfferedSkills, setShowOfferedSkills] = useState(true);
  const [showSoughtSkills, setShowSoughtSkills] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [profiles, setProfiles] = useState<(Match & { level?: string; description?: string })[]>(fallbackProfiles);

  useEffect(() => {
    searchService.getMatches()
      .then(({ data }) => setProfiles(data.length > 0 ? data : fallbackProfiles))
      .catch(() => setProfiles(fallbackProfiles));
  }, []);

  const filteredProfiles = profiles.filter(profile => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      profile.name?.toLowerCase().includes(q) ||
      profile.location?.toLowerCase().includes(q) ||
      profile.description?.toLowerCase().includes(q) ||
      profile.offerte?.some(s => s.toLowerCase().includes(q)) ||
      profile.cercate?.some(s => s.toLowerCase().includes(q));

    const offers = profile.offerte ?? [];
    const seeks = profile.cercate ?? [];
    const matchesOfferedSkills = showOfferedSkills && offers.length > 0;
    const matchesSoughtSkills = showSoughtSkills && seeks.length > 0;

    const matchesLevel = !levelFilter || profile.level === levelFilter;

    const matchesCategory = !categoryFilter ||
      (categoryFilter === "offer" && offers.length > 0) ||
      (categoryFilter === "search" && seeks.length > 0);

    if (!matchesLevel || !matchesCategory) return false;

    if (showOfferedSkills && showSoughtSkills) {
      return matchesSearch && (matchesOfferedSkills || matchesSoughtSkills);
    }
    if (showOfferedSkills && !showSoughtSkills) {
      return matchesSearch && matchesOfferedSkills;
    }
    if (!showOfferedSkills && showSoughtSkills) {
      return matchesSearch && matchesSoughtSkills;
    }
    return matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),_transparent_25%),linear-gradient(180deg,_#090909_0%,_#050505_100%)] px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto flex min-h-[calc(100svh-1.5rem)] w-full max-w-[1280px] overflow-hidden rounded-[28px] border border-orange-500/15 bg-[#0b0b0c] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <aside className="flex w-[235px] shrink-0 flex-col border-r border-zinc-900 bg-[#090a0b]">
          <div className="border-b border-zinc-900 px-5 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/35 bg-orange-500/10">
                <Wrench className="h-5 w-5 text-orange-400" />
              </div>
              <div className="text-left">
                <div className="text-xs uppercase tracking-[0.22em] text-orange-400/70">
                  Skill Match
                </div>
                <div className="text-lg font-semibold text-white">Ricerca</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4">
            <div className="space-y-2">
              {menuItems.map(({ label, icon: Icon, active, path }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => navigate(path)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-colors ${
                    active
                      ? "border border-orange-500/25 bg-orange-500/10 text-orange-300"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate("/")}
              className="mt-4 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Indietro</span>
            </button>
          </nav>

          <div className="border-t border-zinc-900 p-4">
            {user ? (
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex w-full items-center gap-3 rounded-2xl bg-zinc-950 px-3 py-3 hover:bg-zinc-900 transition-colors"
              >
                <img
                  src={user.image_url || "https://cdn.phototourl.com/free/2026-05-12-bac6185b-c4fb-44db-bc6e-99673f2d71cd.jpg"}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="min-w-0 text-left">
                  <div className="truncate text-sm font-medium text-white">{user.name}</div>
                  <div className="text-xs text-zinc-500">Profilo attivo</div>
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-3 py-3 hover:bg-zinc-900 transition-colors text-orange-400 text-sm font-medium"
              >
                Accedi / Registrati
              </button>
            )}
          </div>
        </aside>

        <section className="flex-1 bg-[#101113] p-5 sm:p-7">
          <div className="rounded-[26px] border border-zinc-900 bg-[#121316] p-5 sm:p-6">
            <h1 className="m-0 text-left text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[2.3rem]">
              Ricerca
            </h1>

             <div className="mt-5 space-y-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cerca per nome, skill o parola chiave..."
                    className="h-13 w-full rounded-2xl border border-zinc-800 bg-[#17181b] pl-12 pr-4 text-sm text-white outline-none ring-0 placeholder:text-zinc-500 focus:border-orange-500/60"
                  />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    aria-pressed={showOfferedSkills}
                    className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition-colors ${
                      showOfferedSkills
                        ? "border-orange-500/35 bg-orange-500/10 text-orange-300"
                        : "border-zinc-800 bg-[#17181b] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                    onClick={() => setShowOfferedSkills((value) => !value)}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded text-xs font-bold ${
                        showOfferedSkills
                          ? "bg-orange-500 text-black"
                          : "border border-zinc-700 bg-transparent text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    Skill offerte
                  </button>
                  <button
                    type="button"
                    aria-pressed={showSoughtSkills}
                    className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition-colors ${
                      showSoughtSkills
                        ? "border-orange-500/35 bg-orange-500/10 text-orange-300"
                        : "border-zinc-800 bg-[#17181b] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                    onClick={() => setShowSoughtSkills((value) => !value)}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded text-xs font-bold ${
                        showSoughtSkills
                          ? "bg-orange-500 text-black"
                          : "border border-zinc-700 bg-transparent text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    Skill cercate
                  </button>
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="h-9 rounded-xl border border-zinc-800 bg-[#17181b] px-3 text-xs font-medium text-zinc-400 outline-none focus:border-orange-500/60"
                  >
                    <option value="">Tutti i livelli</option>
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzato">Avanzato</option>
                  </select>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-9 rounded-xl border border-zinc-800 bg-[#17181b] px-3 text-xs font-medium text-zinc-400 outline-none focus:border-orange-500/60"
                  >
                    <option value="">Tutte le categorie</option>
                    <option value="offer">Skill offerte</option>
                    <option value="search">Skill cercate</option>
                  </select>
                </div>
              </div>

            <div className="mt-5 text-left text-sm text-zinc-500">Risultati trovati: {filteredProfiles.length}</div>

             <div className="mt-5 space-y-4">
              {filteredProfiles.map((profile) => (
                <article
                  key={profile.name}
                  className="grid gap-4 rounded-[24px] border border-zinc-800 bg-[#17181b] p-4 transition-colors hover:border-orange-500/30 sm:grid-cols-[1.6fr_1fr_auto] sm:p-5"
                >
                  <div className="flex gap-4">
                    <img
                      src={profile.image_url || "https://cdn.phototourl.com/free/2026-05-12-bac6185b-c4fb-44db-bc6e-99673f2d71cd.jpg"}
                      alt={profile.name}
                      className="h-18 w-18 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0 text-left">
                      <h2 className="m-0 text-[1.85rem] font-semibold leading-tight tracking-[-0.03em] text-white">
                        {profile.name}
                      </h2>
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                      {profile.level && (
                        <span className="mt-2 inline-block text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/20">
                          {profile.level}
                        </span>
                      )}
                      <p className="mt-4 max-w-[430px] text-sm leading-6 text-zinc-400">
                        {profile.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-left">
                    <div>
                      <div className="text-sm font-semibold text-zinc-200">Offre</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(profile.offerte ?? []).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-xl border border-emerald-500/20 bg-emerald-950/70 px-3 py-1.5 text-xs font-medium text-emerald-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-200">Cerca</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(profile.cercate ?? []).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-xl border border-indigo-500/20 bg-indigo-950/70 px-3 py-1.5 text-xs font-medium text-indigo-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => {
                        navigate("/card", { state: { profile } });
                      }}
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 transition-colors hover:border-orange-500/35 hover:text-orange-300"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
