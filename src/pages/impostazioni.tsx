import { useState } from "react";
import {
  ArrowLeft,
  Search,
  FolderOpen,
  User,
  Settings,
  Wrench,
  LogOut,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/lib/AuthContext";
import { userService } from "@/lib/services";

const menuItems = [
  { label: "Ricerca", icon: Search, active: false, path: "/search" },
  { label: "Richieste", icon: FolderOpen, active: false, path: "/richieste" },
  { label: "Profilo", icon: User, active: false, path: "/profile" },
  { label: "Impostazioni", icon: Settings, active: true, path: "/impostazioni" },
];

export default function Impostazioni() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [level, setLevel] = useState(user?.level ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await userService.updateProfile(user.id, { name, bio, location, level });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
                <div className="text-lg font-semibold text-white">Impostazioni</div>
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
          <div className="rounded-[26px] border border-zinc-900 bg-[#121316] p-5 sm:p-6 space-y-8">
            <h1 className="m-0 text-left text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[2.3rem]">
              Impostazioni
            </h1>

            {/* PROFILO */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-5">Profilo</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Nome</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#17181b] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500/60"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Città</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#17181b] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500/60"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-zinc-500 mb-1 block">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full bg-[#17181b] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500/60 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Livello</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-[#17181b] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500/60"
                  >
                    <option value="">Seleziona livello</option>
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzato">Avanzato</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-5 flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 text-black font-bold hover:bg-orange-400 transition disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? "Salvataggio..." : saved ? "Salvato!" : "Salva modifiche"}
              </button>
            </div>

            {/* ACCOUNT */}
            <div className="border-t border-zinc-800 pt-8">
              <h2 className="text-lg font-semibold text-white mb-5">Account</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Email</label>
                  <div className="w-full bg-[#17181b] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400">
                    {user?.email ?? "—"}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-red-500/40 bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 transition"
                >
                  <LogOut size={18} />
                  Esci
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}