import { useNavigate } from "react-router";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";

export default function ProfiloPubblico() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("panoramica");
  const [status, setStatus] = useState<"idle" | "pending" | "accepted" | "declined">("idle");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");

  const [openMenu, setOpenMenu] = useState(false);

  const handleRequestClick = () => {
    if (status === "idle") {
      setStatus("pending");
      setPopupMsg("Invio richiesta completato con successo ✅");
      setShowPopup(true);

      setTimeout(() => setShowPopup(false), 2500);
    } else if (status === "pending") {
      setPopupMsg("Richiesta annullata ❌");
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        setStatus("idle");
      }, 3000);
    }
  };
  const skillsOfferte = [
    { name: "React" },
    { name: "Python" },
    { name: "UI Design" },
  ];

  const skillsCercate = [
    { name: "Node.js" },
    { name: "Docker" },
    { name: "PostgreSQL" },
    { name: "System Design" },
  ];

  const livello = "Intermedio";

  return (
    <div className="min-h-screen bg-black p-6 flex justify-center text-white">
      <div className="w-full max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="bg-zinc-950 rounded-3xl border border-orange-500 p-6 shadow-[0_0_20px_rgba(249,115,22,0.15)]">

          <div className="flex flex-col md:flex-row md:items-start gap-6">

            {/* FOTO */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-orange-500 bg-zinc-900">
              <img
                src="https://cdn.phototourl.com/free/2026-05-12-bac6185b-c4fb-44db-bc6e-99673f2d71cd.jpg"
                className="w-full h-full object-cover"
                alt="profile"
              />
            </div>

            {/* INFO */}
            <div className="flex-1 text-left">
              <h2 className="text-3xl font-semibold">Username</h2>

              <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                <MapPin size={16} className="text-orange-500" />
                <span>Sicilia, Italia</span>
              </div>

              <p className="text-zinc-400 text-sm mt-2">
                Sviluppatore Frontend con esperienza in React e TypeScript.
              </p>
            </div>

            {/* BOTTONI */}
            <div className="flex gap-2">
              <button
                onClick={handleRequestClick}
                className={`px-4 py-2 text-sm rounded-lg transition ${
                  status === "idle"
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : status === "pending"
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : status === "accepted"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                }`} 
              >
                {status === "idle"
                  ? "Invia richiesta"
                  : status === "pending"
                    ? "In attesa di risposta..."
                    : status === "accepted"
                      ? "Richiesta accettata ✅"
                      : "Richiesta declinata ❌"}
              </button>
              <div className="relative">
                <button
                  onClick={() => setOpenMenu((v) => !v)}
                  className="px-3 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
                >
                  ⋮
                </button>
                {openMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg overflow-hidden z-50">
                    <button
                      onClick={() => {
                        alert("Utente bloccato 🔒");
                        setOpenMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800"
                    >
                      🔒 Blocca
                    </button>
                    <button
                      onClick={() => {
                        alert("Segnalazione inviata 🚩");
                        setOpenMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 text-red-400"
                    >
                      🚩 Segnala
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* TAB */}
          <div className="flex gap-6 mt-6 border-b border-zinc-800">
            {[
              { id: "panoramica", label: "Panoramica" },
              { id: "offerte", label: "Skill offerte" },
              { id: "cercate", label: "Skill cercate" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`pb-3 text-sm border-b-2 transition ${
                  tab === t.id
                    ? "border-orange-500 text-white"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

        </div>

        {/* PANORAMICA */}
        {tab === "panoramica" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-lg font-semibold mb-3">Bio</h3>
              <p className="text-zinc-400 text-sm">
                Mi chiamo Luca e sono uno sviluppatore frontend specializzato in React e Next.js.
              </p>
            </div>

            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-lg font-semibold mb-3">Livello</h3>
              <p className="text-zinc-400 text-sm">{livello}</p>
            </div>

            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-lg font-semibold mb-3">Skill offerte</h3>
              <div className="flex flex-wrap gap-2">
                {skillsOfferte.map((s, i) => (
                  <span
                    key={i}
                    className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-lg font-semibold mb-3">Skill cercate</h3>
              <div className="flex flex-wrap gap-2">
                {skillsCercate.map((s, i) => (
                  <span
                    key={i}
                    className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}
        {/* POPUP INFO */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-zinc-900 border border-orange-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              <p className="text-sm">{popupMsg}</p>
            </div>
          </div>
        )}

        {/* SKILL OFFERTE */}
        {tab === "offerte" && (
          <div>

            {/* SEARCH BAR */}
            <div className="relative mb-5">
              <input
                type="text"
                placeholder="Cerca skill Offerte..."
                className="
                  w-full
                  bg-black
                  border-2
                  border-orange-500
                  rounded-2xl
                  p-3
                  pr-44
                  text-white
                  outline-none
                  focus:ring-2
                  focus:ring-orange-400
                  placeholder:text-orange-500/30
                "
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <Search size={18} className="text-orange-500" />
              </div>
            </div>
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-lg font-semibold mb-3">Skill offerte</h3>
              <div className="flex flex-wrap gap-2">
                {skillsOfferte.map((s, i) => (
                  <span
                    key={i}
                    className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* SKILL CERCATE */}
        {tab === "cercate" && (
          <div>

            {/* SEARCH BAR */}
            <div className="relative mb-5">
              <input
                type="text"
                placeholder="Cerca skill Cercate"
                className="
                  w-full
                  bg-black
                  border-2
                  border-orange-500
                  rounded-2xl
                  p-3
                  pr-44
                  text-white
                  outline-none
                  focus:ring-2
                  focus:ring-orange-400
                  placeholder:text-orange-500/30
                "
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <Search size={18} className="text-orange-500" />
              </div>
            </div>
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-lg font-semibold mb-3">Skill cercate</h3>
              <div className="flex flex-wrap gap-2">
                {skillsCercate.map((s, i) => (
                  <span
                    key={i}
                    className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}