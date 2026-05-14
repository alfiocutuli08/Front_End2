import { useEffect, useState } from "react";
import { Search, Bell, Check, X, ArrowLeft, Star, MoreVertical } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { requestService, feedbackService } from "@/lib/services";
import type { Request } from "@/lib/types";

export default function Richieste() {
  const { user } = useAuth();
  const [tab, setTab] = useState("incoming");
  const [myRequests, setMyRequests] = useState<Request[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  const [confirmAction, setConfirmAction] = useState<{ type: string; req: Request } | null>(null);

  const [feedbackReq, setFeedbackReq] = useState<Request | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackHover, setFeedbackHover] = useState(0);

  const fetchRequests = () => {
    requestService.getMyRequests().then(({ data }) => setMyRequests(data)).catch(() => {});
    requestService.getPendingRequests().then(({ data }) => setPendingCount(data.length)).catch(() => {});
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const incoming = myRequests.filter((r) => r.to_user_id === user?.id && r.status === "pending");
  const outgoing = myRequests.filter((r) => r.from_user_id === user?.id);

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
        to_user_id: feedbackReq.from_user_id === user?.id ? feedbackReq.to_user_id : feedbackReq.from_user_id,
        request_id: feedbackReq.id,
        rating: feedbackRating,
        comment: feedbackComment,
      });
    } catch {}
    setFeedbackReq(null);
    setFeedbackRating(0);
    setFeedbackComment("");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <aside className="w-[260px] border-r border-orange-500/20 bg-[#0b0b0b] p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Bell size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold">SkillSwap</h1>
              <p className="text-xs text-zinc-500">Exchange your skills</p>
            </div>
          </div>
          <nav className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-900 transition">
              <Search size={18} />
              Ricerca
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 shadow-lg shadow-orange-500/10">
              <div className="flex items-center gap-3">
                <Bell size={18} />
                Richieste
              </div>
              {pendingCount > 0 && (
                <span className="bg-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-900 transition">
              <ArrowLeft size={18} />
              Profilo
            </button>
          </nav>
        </div>
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-3 flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/150?img=68"
            alt=""
            className="w-11 h-11 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold">{user?.name ?? "Utente"}</h2>
            <p className="text-xs text-zinc-500">Frontend Developer</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2">Richieste</h1>
            <p className="text-zinc-500">Gestisci le richieste in arrivo e quelle inviate.</p>
          </div>

          <div className="flex gap-10 border-b border-zinc-800 mb-8">
            <button
              onClick={() => setTab("incoming")}
              className={`pb-4 text-sm font-medium transition flex items-center gap-2 ${
                tab === "incoming"
                  ? "text-orange-400 border-b-2 border-orange-500"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              In arrivo
              {incoming.length > 0 && (
                <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {incoming.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab("outgoing")}
              className={`pb-4 text-sm font-medium transition ${
                tab === "outgoing"
                  ? "text-orange-400 border-b-2 border-orange-500"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Inviate
            </button>
          </div>

          {tab === "incoming" && (
            <div className="space-y-5">
              {incoming.length === 0 && (
                <p className="text-zinc-500 text-center py-10">Nessuna richiesta in arrivo.</p>
              )}
              {incoming.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#0b0b0b] border border-zinc-800 hover:border-orange-500/30 transition rounded-3xl p-5 flex items-center justify-between shadow-xl"
                >
                  <div className="flex items-center gap-5 flex-1">
                    <img
                      src="https://i.pravatar.cc/150?img=32"
                      alt=""
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="max-w-[500px]">
                      <h2 className="text-xl font-semibold">{req.from_user_name || "Utente"}</h2>
                      <p className="text-sm text-zinc-500 mb-2">Richiesta di collaborazione</p>
                      <p className="text-sm text-zinc-300">Vorrebbe scambiare competenze con te.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-500 whitespace-nowrap">
                      {new Date(req.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setConfirmAction({ type: "accept", req })}
                      className="px-5 py-2 rounded-xl border border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition flex items-center gap-2"
                    >
                      <Check size={16} />
                      Accetta
                    </button>
                    <button
                      onClick={() => setConfirmAction({ type: "decline", req })}
                      className="px-5 py-2 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition flex items-center gap-2"
                    >
                      <X size={16} />
                      Rifiuta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "outgoing" && (
            <div className="space-y-5">
              {outgoing.length === 0 && (
                <p className="text-zinc-500 text-center py-10">Nessuna richiesta inviata.</p>
              )}
              {outgoing.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#0b0b0b] border border-zinc-800 hover:border-orange-500/30 transition rounded-3xl p-5 flex items-center justify-between shadow-xl"
                >
                  <div className="flex items-center gap-5">
                    <img
                      src="https://i.pravatar.cc/150?img=15"
                      alt=""
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">{req.to_user_name || "Utente"}</h2>
                      <p className="text-sm text-zinc-500 mb-2">Richiesta di collaborazione</p>
                      <p className="text-sm text-zinc-300">In attesa di risposta.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-500">{new Date(req.created_at).toLocaleDateString()}</span>
                    <div
                      className={`px-4 py-2 rounded-xl text-sm font-medium ${
                        req.status === "pending"
                          ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
                          : req.status === "accepted"
                            ? "bg-green-500/10 border border-green-500/30 text-green-400"
                            : req.status === "completed"
                              ? "bg-blue-500/10 border border-blue-500/30 text-blue-400"
                              : "bg-red-500/10 border border-red-500/30 text-red-400"
                      }`}
                    >
                      {req.status === "pending"
                        ? "In attesa"
                        : req.status === "accepted"
                          ? "Accettata"
                          : req.status === "completed"
                            ? "Completata"
                            : "Rifiutata"}
                    </div>
                    {req.status === "accepted" && (
                      <button
                        onClick={() => handleComplete(req)}
                        className="px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 hover:bg-orange-500/30 transition flex items-center gap-2"
                      >
                        <Check size={16} />
                        Completa
                      </button>
                    )}
                    {req.status === "pending" && (
                      <button
                        onClick={() => setConfirmAction({ type: "cancel", req })}
                        className="px-4 py-2 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                      >
                        Cancella
                      </button>
                    )}
                    <button className="w-11 h-11 rounded-xl border border-zinc-700 hover:border-zinc-500 bg-zinc-900 flex items-center justify-center transition">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CONFIRM MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-orange-500/40 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">
              {confirmAction.type === "accept"
                ? "Accetta richiesta?"
                : confirmAction.type === "decline"
                  ? "Rifiuta richiesta?"
                  : "Cancella richiesta?"}
            </h3>
            <p className="text-zinc-400 mb-8">
              {confirmAction.type === "accept"
                ? "Confermando, accetterai la richiesta di collaborazione."
                : confirmAction.type === "decline"
                  ? "Confermando, rifiuterai definitivamente questa richiesta."
                  : "Confermando, cancellerai la richiesta inviata."}
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleConfirm}
                className={`flex-1 py-3 rounded-2xl font-bold transition ${
                  confirmAction.type === "accept"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                Conferma
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {feedbackReq && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-orange-500/40 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold mb-1">Lascia un feedback</h3>
            <p className="text-zinc-400 text-sm mb-6">Valuta la tua esperienza di scambio.</p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFeedbackRating(star)}
                  onMouseEnter={() => setFeedbackHover(star)}
                  onMouseLeave={() => setFeedbackHover(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={
                      star <= (feedbackHover || feedbackRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-zinc-600"
                    }
                  />
                </button>
              ))}
            </div>

            <textarea
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="Scrivi un commento (opzionale)..."
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white text-sm outline-none focus:border-orange-500 resize-none mb-6"
            />

            <div className="flex gap-4">
              <button
                onClick={handleSubmitFeedback}
                disabled={feedbackRating === 0}
                className={`flex-1 py-3 rounded-2xl font-bold transition ${
                  feedbackRating === 0
                    ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-black"
                }`}
              >
                Invia feedback
              </button>
              <button
                onClick={() => setFeedbackReq(null)}
                className="flex-1 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition"
              >
                Salta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
