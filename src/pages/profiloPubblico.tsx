import { useEffect, useState } from "react";
import { Search, MapPin, Star } from "lucide-react";
import { requestService, blockService, reportService, userService, feedbackService } from "@/lib/services";
import type { UserProfile, Feedback } from "@/lib/types";

export default function ProfiloPubblico() {
  const [tab, setTab] = useState("panoramica");
  const [status, setStatus] = useState<"idle" | "pending" | "accepted" | "declined">("idle");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [requestId, setRequestId] = useState<number | null>(null);

  const [openMenu, setOpenMenu] = useState(false);

  const [isBlocked, setIsBlocked] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const userId = Number(new URLSearchParams(window.location.search).get("id")) || 1;

  useEffect(() => {
    userService.getPublicProfile(userId).then(({ data }) => setProfile(data)).catch(() => {});
    blockService.getBlockedUsers().then(({ data }) => setIsBlocked(data.includes(userId))).catch(() => {});
    feedbackService.getUserFeedback(userId).then(({ data }) => setFeedbacks(data)).catch(() => {});
  }, [userId]);

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((a, f) => a + f.rating, 0) / feedbacks.length).toFixed(1)
    : null;

  const handleRequestClick = () => {
    if (isBlocked) return;

    if (status === "idle") {
      setStatus("pending");
      requestService.sendRequest(userId).then(({ data }) => setRequestId(data.id)).catch(() => {});
      setPopupMsg("Invio richiesta completato con successo ✅");
      setShowPopup(true);

      setTimeout(() => setShowPopup(false), 2500);
    } else if (status === "pending") {
      if (requestId) requestService.cancelRequest(requestId).catch(() => {});
      setRequestId(null);
      setPopupMsg("Richiesta annullata ❌");
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        setStatus("idle");
      }, 3000);
    }
  };
  const skillsOfferte = profile?.skills?.filter((s) => s.category === "offer").map((s) => s.name) ?? [
    "React", "Python", "UI Design",
  ];

  const skillsCercate = profile?.skills?.filter((s) => s.category === "search").map((s) => s.name) ?? [
    "Node.js", "Docker", "PostgreSQL", "System Design",
  ];

  const livello = profile?.level ?? "Intermedio";

  return (
    <div className="min-h-screen bg-black p-6 flex justify-center text-white">
      <div className="w-full max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="bg-zinc-950 rounded-3xl border border-orange-500 p-6 shadow-[0_0_20px_rgba(249,115,22,0.15)]">

          <div className="flex flex-col md:flex-row md:items-start gap-6">

            {/* FOTO */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-orange-500 bg-zinc-900">
              <img
                src={profile?.image_url ?? "https://cdn.phototourl.com/free/2026-05-12-bac6185b-c4fb-44db-bc6e-99673f2d71cd.jpg"}
                className="w-full h-full object-cover"
                alt="profile"
              />
            </div>

            {/* INFO */}
            <div className="flex-1 text-left">
              <h2 className="text-3xl font-semibold">{profile?.name ?? "Username"}</h2>

              <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                <MapPin size={16} className="text-orange-500" />
                <span>{profile?.location ?? "Sicilia, Italia"}</span>
              </div>

              <p className="text-zinc-400 text-sm mt-2">
                {profile?.bio ?? "Sviluppatore Frontend con esperienza in React e TypeScript."}
              </p>
            </div>

            {/* BOTTONI */}
            <div className="flex gap-2">
              <button
                onClick={handleRequestClick}
                className={`px-4 py-2 text-sm rounded-lg transition ${
                  isBlocked
                    ? "bg-red-600 text-white cursor-not-allowed"
                    : status === "idle"
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : status === "pending"
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                        : status === "accepted"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                }`} 
              >
                {isBlocked
                  ? "Utente bloccato 🔒"
                  : status === "idle"
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
                    {isBlocked ? (
                      <button
                        onClick={() => {
                          setOpenMenu(false);
                          blockService.unblockUser(userId).catch(() => {});
                          setIsBlocked(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800"
                      >
                        🔓 Sblocca
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setOpenMenu(false);
                          blockService.blockUser(userId).catch(() => {});
                          setIsBlocked(true);
                          setShowBlockConfirm(true);
                          setTimeout(() => setShowBlockConfirm(false), 2500);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800"
                      >
                        🔒 Blocca
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setOpenMenu(false);
                        setShowReportPopup(true);
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
                {profile?.bio ?? "Mi chiamo Luca e sono uno sviluppatore frontend specializzato in React e Next.js."}
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
                    {s}
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
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* FEEDBACK */}
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 md:col-span-2">
              <h3 className="text-lg font-semibold mb-3">Feedback ricevuti</h3>
              {feedbacks.length === 0 ? (
                <p className="text-zinc-500 text-sm">Nessun feedback ancora.</p>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-zinc-800">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={20}
                          className={s <= Math.round(Number(avgRating)) ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-yellow-400">{avgRating}</span>
                    <span className="text-zinc-500 text-sm">({feedbacks.length} recensioni)</span>
                  </div>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {feedbacks.map((fb) => (
                      <div key={fb.id} className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-zinc-300">{fb.from_user_name || "Anonimo"}</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={14}
                                className={s <= fb.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"}
                              />
                            ))}
                          </div>
                        </div>
                        {fb.comment && <p className="text-zinc-400 text-sm">{fb.comment}</p>}
                        <p className="text-zinc-600 text-xs mt-2">{new Date(fb.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
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

        {/* POPUP BLOCCO CONFERMA */}
        {showBlockConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-zinc-900 border border-orange-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              <p className="text-sm">Utente bloccato 🔒</p>
            </div>
          </div>
        )}

        {/* POPUP SEGNALA */}
        {showReportPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-zinc-900 border border-orange-500 p-6 rounded-2xl text-white w-full max-w-md mx-4 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Segnala utente 🚩</h3>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Inserisci il motivo della segnalazione..."
                rows={4}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white text-sm outline-none focus:border-orange-500 resize-none"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowReportPopup(false);
                    setReportReason("");
                  }}
                  className="px-4 py-2 text-sm bg-zinc-700 hover:bg-zinc-600 rounded-lg transition"
                >
                  Annulla
                </button>
                <button
                  onClick={() => {
                    reportService.reportUser(userId, reportReason).catch(() => {});
                    setShowReportPopup(false);
                    setReportReason("");
                    setShowReportConfirm(true);
                    setTimeout(() => setShowReportConfirm(false), 2500);
                  }}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  Invia segnalazione
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POPUP SEGNALAZIONE INVIATA */}
        {showReportConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-zinc-900 border border-orange-500 text-white px-6 py-4 rounded-2xl shadow-lg">
              <p className="text-sm">Segnalazione inviata 🚩</p>
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
                    {s}
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
                    {s}
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