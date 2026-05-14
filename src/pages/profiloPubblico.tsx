import { useEffect, useState } from "react";
import { Search, MapPin, Star } from "lucide-react";
import { requestService, userService, feedbackService, blockService, reportService } from "@/lib/services";
import type { UserProfile, Feedback } from "@/lib/types";

export default function ProfiloPubblico() {
  const [tab, setTab] = useState("panoramica");
  const [status, setStatus] = useState<"idle" | "pending" | "accepted" | "declined" | "blocked">("idle");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showConfirmBlock, setShowConfirmBlock] = useState(false);

  const userId = Number(new URLSearchParams(window.location.search).get("id")) || 1;
  const myId = Number(localStorage.getItem("user_id"));

  useEffect(() => {
    userService.getPublicProfile(userId).then(({ data }) => setProfile(data)).catch(() => {});
    feedbackService.getUserFeedback(userId).then(({ data }) => setFeedbacks(data)).catch(() => {});
  }, [userId]);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((a, f) => a + f.rating, 0) / feedbacks.length).toFixed(1)
    : null;

  const handleRequestClick = () => {
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

  const handleBlock = async () => {
    try {
      await blockService.blockUser(userId);
    } catch {}
    setStatus("blocked");
    setPopupMsg("Utente bloccato ✅");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500);
    setShowConfirmBlock(false);
  };

  const handleUnblock = async () => {
    try {
      await blockService.unblockUser(userId);
    } catch {}
    setStatus("idle");
    setPopupMsg("Utente sbloccato ✅");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500);
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    try {
      await reportService.reportUser(userId, reportReason);
    } catch {}
    setPopupMsg("Segnalazione effettuata ✅");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500);
    setShowReportModal(false);
    setReportReason("");
  };

  const skillsOfferte = profile?.skills?.filter((s) => s.category === "offer") ?? [];
  const skillsCercate = profile?.skills?.filter((s) => s.category === "search") ?? [];
  const livello = profile?.level ?? "Intermedio";

  return (
    <div className="min-h-screen bg-black p-6 flex justify-center text-white">
      <div className="w-full max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="bg-zinc-950 rounded-3xl border border-orange-500 p-6 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
          <div className="flex flex-col md:flex-row md:items-start gap-6">

            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-orange-500 bg-zinc-900">
              <img
                src={profile?.image_url ?? "https://cdn.phototourl.com/free/2026-05-12-bac6185b-c4fb-44db-bc6e-99673f2d71cd.jpg"}
                className="w-full h-full object-cover"
                alt="profile"
              />
            </div>

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

            <div className="flex gap-2 items-start">
              <button
                onClick={handleRequestClick}
                className={`px-4 py-2 text-sm rounded-lg transition ${
                  status === "idle"
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : status === "pending"
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : status === "accepted"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : status === "declined"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-red-600 border border-red-500 text-white cursor-not-allowed"
                }`}
              >
                {status === "idle"
                  ? "Invia richiesta"
                  : status === "pending"
                    ? "In attesa di risposta..."
                    : status === "accepted"
                      ? "Richiesta accettata ✅"
                      : status === "declined"
                        ? "Richiesta declinata ❌"
                        : "🚫 Utente bloccato"}
              </button>

              {/* THREE-DOT MENU */}
              {myId !== userId && (
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                    className="p-2 rounded-lg hover:bg-zinc-800 transition text-zinc-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>
                  {menuOpen && (
                    <div
                      className="absolute right-0 top-full mt-1 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          if (status === "blocked") {
                            handleUnblock();
                          } else {
                            setShowConfirmBlock(true);
                          }
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 transition"
                      >
                        {status === "blocked" ? "Sblocca utente" : "Blocca utente"}
                      </button>
                      <button
                        onClick={() => { setMenuOpen(false); setShowReportModal(true); }}
                        className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 transition"
                      >
                        Segnala utente
                      </button>
                    </div>
                  )}
                </div>
              )}
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
                {skillsOfferte.length === 0 && <p className="text-zinc-500 text-sm">Nessuna</p>}
                {skillsOfferte.map((s, i) => (
                  <span key={i} className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">
                    {s.skill_name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-lg font-semibold mb-3">Skill cercate</h3>
              <div className="flex flex-wrap gap-2">
                {skillsCercate.length === 0 && <p className="text-zinc-500 text-sm">Nessuna</p>}
                {skillsCercate.map((s, i) => (
                  <span key={i} className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">
                    {s.skill_name}
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
                        <Star key={s} size={20} className={s <= Math.round(Number(avgRating)) ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"} />
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
                              <Star key={s} size={14} className={s <= fb.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"} />
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

        {/* SKILL OFFERTE TAB */}
        {tab === "offerte" && (
          <div>
            <div className="relative mb-5">
              <input type="text" placeholder="Cerca skill Offerte..." className="w-full bg-black border-2 border-orange-500 rounded-2xl p-3 pr-44 text-white outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-orange-500/30" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <Search size={18} className="text-orange-500" />
              </div>
            </div>
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-lg font-semibold mb-3">Skill offerte</h3>
              <div className="flex flex-wrap gap-2">
                {skillsOfferte.map((s, i) => (
                  <span key={i} className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">{s.skill_name}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SKILL CERCATE TAB */}
        {tab === "cercate" && (
          <div>
            <div className="relative mb-5">
              <input type="text" placeholder="Cerca skill Cercate" className="w-full bg-black border-2 border-orange-500 rounded-2xl p-3 pr-44 text-white outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-orange-500/30" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <Search size={18} className="text-orange-500" />
              </div>
            </div>
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5">
              <h3 className="text-lg font-semibold mb-3">Skill cercate</h3>
              <div className="flex flex-wrap gap-2">
                {skillsCercate.map((s, i) => (
                  <span key={i} className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">{s.skill_name}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONFIRM BLOCK */}
        {showConfirmBlock && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowConfirmBlock(false)}>
            <div className="bg-zinc-900 border border-orange-500 rounded-2xl p-6 w-80" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-3">Bloccare questo utente?</h3>
              <p className="text-zinc-400 text-sm mb-6">Non potrai più ricevere richieste da questo utente.</p>
              <div className="flex gap-3">
                <button onClick={handleBlock} className="flex-1 bg-red-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-red-700">Blocca</button>
                <button onClick={() => { setShowConfirmBlock(false); setPopupMsg("Blocco annullato"); setShowPopup(true); setTimeout(() => setShowPopup(false), 2500); }} className="flex-1 bg-zinc-800 text-white py-2 rounded-xl text-sm font-bold hover:bg-zinc-700">Annulla</button>
              </div>
            </div>
          </div>
        )}

        {/* REPORT MODAL */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowReportModal(false)}>
            <div className="bg-zinc-900 border border-orange-500 rounded-2xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-3">Segnala utente</h3>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Descrivi il motivo della segnalazione..."
                className="w-full min-h-[100px] bg-black border border-orange-500/30 rounded-xl p-3 text-white text-sm outline-none focus:border-orange-500 resize-none placeholder:text-orange-500/30"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={handleReport} className="flex-1 bg-orange-500 text-black py-2 rounded-xl text-sm font-bold hover:bg-orange-600">Invia segnalazione</button>
                <button onClick={() => { setShowReportModal(false); setReportReason(""); setPopupMsg("Segnalazione annullata"); setShowPopup(true); setTimeout(() => setShowPopup(false), 2500); }} className="flex-1 bg-zinc-800 text-white py-2 rounded-xl text-sm font-bold hover:bg-zinc-700">Annulla</button>
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
      </div>
    </div>
  );
}
