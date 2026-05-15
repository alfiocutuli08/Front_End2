import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  X,
  Search,
  FolderOpen,
  User,
  Settings,
  Wrench,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/lib/AuthContext";
import { requestService, feedbackService } from "@/lib/services";
import type { Request } from "@/lib/types";

const menuItems = [
  { label: "Ricerca", icon: Search, active: false, path: "/search" },
  { label: "Richieste", icon: FolderOpen, active: true, path: "/richieste" },
  { label: "Profilo", icon: User, active: false, path: "/profile" },
  { label: "Impostazioni", icon: Settings, active: false, path: "/impostazioni" },
];

export default function Richieste() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState("incoming");
  const [incoming, setIncoming] = useState<Request[]>([]);
  const [outgoing, setOutgoing] = useState<Request[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  const [confirmAction, setConfirmAction] = useState<{ type: string; req: Request } | null>(null);

  const [feedbackReq, setFeedbackReq] = useState<Request | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackHover, setFeedbackHover] = useState(0);

  const fetchRequests = () => {
    requestService.getMyRequests("received").then(({ data }) => {
      setIncoming(data.requests);
      setPendingCount(data.pending_count);
    }).catch(() => {});
    requestService.getMyRequests("sent").then(({ data }) => {
      setOutgoing(data.requests);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { type, req } = confirmAction;
    try {
      if (type === "accept") await requestService.acceptRequest(req.id);
      else if (type === "decline") await requestService.declineRequest(req.id);
      else if (type === "cancel") await requestService.cancelRequest(req.id);
    } catch {}
    setConfirmAction(null);
    fetchRequests();
  };

  const handleComplete = async (req: Request) => {
    try {
      await requestService.completeRequest(req.id);
      fetchRequests();
      setFeedbackReq(req);
    } catch {}
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackReq || feedbackRating === 0) return;
    try {
      await feedbackService.submitFeedback({
        session_request_id: feedbackReq.id,
        rating: feedbackRating,
        comment: feedbackComment,
      });
    } catch {}
    setFeedbackReq(null);
    setFeedbackRating(0);
    setFeedbackComment("");
  };

  const statusLabel: Record<string, string> = {
    pending: "In attesa",
    accepted: "Accettata",
    completed: "Completata",
    rejected: "Rifiutata",
    cancelled: "Annullata",
  };

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    accepted: "bg-green-500/10 border-green-500/30 text-green-400",
    completed: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    rejected: "bg-red-500/10 border-red-500/30 text-red-400",
    cancelled: "bg-zinc-500/10 border-zinc-500/30 text-zinc-400",
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
                <div className="text-xs uppercase tracking-[0.22em] text-orange-400/70">Skill Match</div>
                <div className="text-lg font-semibold text-white">Richieste</div>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-2">
              {menuItems.map(({ label, icon: Icon, active, path }) => (
                <button key={label} type="button" onClick={() => navigate(path)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-colors ${active ? "border border-orange-500/25 bg-orange-500/10 text-orange-300" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"}`}>
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{label}</span>
                  {label === "Richieste" && pendingCount > 0 && (
                    <span className="ml-auto bg-orange-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">{pendingCount}</span>
                  )}
                </button>
              ))}
            </div>
            <button onClick={() => navigate("/")} className="mt-4 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors">
              <ArrowLeft size={18} /> <span className="font-medium">Indietro</span>
            </button>
          </nav>
          <div className="border-t border-zinc-900 p-4">
            {user ? (
              <button type="button" onClick={() => navigate("/profile")} className="flex w-full items-center gap-3 rounded-2xl bg-zinc-950 px-3 py-3 hover:bg-zinc-900 transition-colors">
                <img src={user.image_url || "https://cdn.phototourl.com/free/2026-05-12-bac6185b-c4fb-44db-bc6e-99673f2d71cd.jpg"} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                <div className="min-w-0 text-left">
                  <div className="truncate text-sm font-medium text-white">{user.name}</div>
                  <div className="text-xs text-zinc-500">Profilo attivo</div>
                </div>
              </button>
            ) : (
              <button type="button" onClick={() => navigate("/login")} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-3 py-3 hover:bg-zinc-900 transition-colors text-orange-400 text-sm font-medium">
                Accedi / Registrati
              </button>
            )}
          </div>
        </aside>

        <section className="flex-1 bg-[#101113] p-5 sm:p-7">
          <div className="rounded-[26px] border border-zinc-900 bg-[#121316] p-5 sm:p-6">
            <h1 className="m-0 text-left text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[2.3rem]">Richieste</h1>
            <p className="mt-2 text-sm text-zinc-500">Gestisci le richieste in arrivo e quelle inviate.</p>

            <div className="flex gap-10 border-b border-zinc-800 mt-8 mb-8">
              <button onClick={() => setTab("incoming")} className={`pb-4 text-sm font-medium transition flex items-center gap-2 ${tab === "incoming" ? "text-orange-400 border-b-2 border-orange-500" : "text-zinc-500 hover:text-zinc-300"}`}>
                In arrivo
                {incoming.filter(r => r.status === "pending").length > 0 && (
                  <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {incoming.filter(r => r.status === "pending").length}
                  </span>
                )}
              </button>
              <button onClick={() => setTab("outgoing")} className={`pb-4 text-sm font-medium transition ${tab === "outgoing" ? "text-orange-400 border-b-2 border-orange-500" : "text-zinc-500 hover:text-zinc-300"}`}>
                Inviate
              </button>
            </div>

            {tab === "incoming" && (
              <div className="space-y-4">
                {incoming.length === 0 && <p className="text-zinc-500 text-center py-16 text-sm">Nessuna richiesta in arrivo.</p>}
                {incoming.map((req) => (
                  <div key={req.id} className="flex items-center justify-between bg-[#17181b] border border-zinc-800 hover:border-orange-500/30 transition rounded-2xl p-4">
                    <div className="flex items-center gap-4">
                      <img src="https://i.pravatar.cc/150?img=32" alt="" className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h3 className="font-semibold text-white">{req.sender_name || "Utente"}</h3>
                        <p className="text-xs text-zinc-500">{new Date(req.created_at).toLocaleDateString()}</p>
                        {req.skill_name && <p className="text-xs text-orange-400 mt-1">{req.skill_name}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {req.status === "pending" && (
                        <>
                          <button onClick={() => setConfirmAction({ type: "accept", req })} className="px-4 py-2 rounded-xl border border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition flex items-center gap-2 text-sm">
                            <Check size={16} /> Accetta
                          </button>
                          <button onClick={() => setConfirmAction({ type: "decline", req })} className="px-4 py-2 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition flex items-center gap-2 text-sm">
                            <X size={16} /> Rifiuta
                          </button>
                        </>
                      )}
                      {req.status !== "pending" && (
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${statusColor[req.status] || ""}`}>
                          {statusLabel[req.status] || req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "outgoing" && (
              <div className="space-y-4">
                {outgoing.length === 0 && <p className="text-zinc-500 text-center py-16 text-sm">Nessuna richiesta inviata.</p>}
                {outgoing.map((req) => (
                  <div key={req.id} className="flex items-center justify-between bg-[#17181b] border border-zinc-800 hover:border-orange-500/30 transition rounded-2xl p-4">
                    <div className="flex items-center gap-4">
                      <img src="https://i.pravatar.cc/150?img=15" alt="" className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h3 className="font-semibold text-white">{req.receiver_name || "Utente"}</h3>
                        <p className="text-xs text-zinc-500">{new Date(req.created_at).toLocaleDateString()}</p>
                        {req.skill_name && <p className="text-xs text-orange-400 mt-1">{req.skill_name}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${statusColor[req.status] || ""}`}>
                        {statusLabel[req.status] || req.status}
                      </span>
                      {req.status === "accepted" && (
                        <button onClick={() => handleComplete(req)} className="px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 hover:bg-orange-500/30 transition flex items-center gap-2 text-sm">
                          <Check size={16} /> Completa
                        </button>
                      )}
                      {req.status === "pending" && (
                        <button onClick={() => setConfirmAction({ type: "cancel", req })} className="px-4 py-2 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-sm">
                          Cancella
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#121316] border border-orange-500/40 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2 text-white">
              {confirmAction.type === "accept" ? "Accetta richiesta?" : confirmAction.type === "decline" ? "Rifiuta richiesta?" : "Cancella richiesta?"}
            </h3>
            <p className="text-zinc-400 mb-8">
              {confirmAction.type === "accept" ? "Confermando, accetterai la richiesta di collaborazione." : confirmAction.type === "decline" ? "Confermando, rifiuterai definitivamente questa richiesta." : "Confermando, cancellerai la richiesta inviata."}
            </p>
            <div className="flex gap-4">
              <button onClick={handleConfirm} className={`flex-1 py-3 rounded-2xl font-bold transition ${confirmAction.type === "accept" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}>
                Conferma
              </button>
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition">
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {feedbackReq && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#121316] border border-orange-500/40 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold mb-1 text-white">Lascia un feedback</h3>
            <p className="text-zinc-400 text-sm mb-6">Valuta la tua esperienza di scambio.</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setFeedbackRating(star)} onMouseEnter={() => setFeedbackHover(star)} onMouseLeave={() => setFeedbackHover(0)} className="transition-transform hover:scale-110">
                  <Star size={36} className={star <= (feedbackHover || feedbackRating) ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"} />
                </button>
              ))}
            </div>
            <textarea value={feedbackComment} onChange={(e) => setFeedbackComment(e.target.value)} placeholder="Scrivi un commento (opzionale)..." rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white text-sm outline-none focus:border-orange-500 resize-none mb-6" />
            <div className="flex gap-4">
              <button onClick={handleSubmitFeedback} disabled={feedbackRating === 0} className={`flex-1 py-3 rounded-2xl font-bold transition ${feedbackRating === 0 ? "bg-zinc-700 text-zinc-500 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-black"}`}>
                Invia feedback
              </button>
              <button onClick={() => setFeedbackReq(null)} className="flex-1 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition">
                Salta
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
