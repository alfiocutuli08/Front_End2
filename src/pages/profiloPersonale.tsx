import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LogOut, Search, Star } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { authService, feedbackService, skillService, userSkillService } from "@/lib/services";
import type { Feedback, Skill, UserSkill } from "@/lib/types";

export default function profiloPersonale() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isModified, setIsModified] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [avgRating, setAvgRating] = useState<string | null>(null);

  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState("");

  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("Intermedio");
  const [newSkillType, setNewSkillType] = useState<"offered" | "wanted">("offered");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;
    feedbackService.getUserFeedback(user.id).then(({ data }) => {
      setFeedbacks(data.feedback);
      setAvgRating(data.average_rating ? data.average_rating.toFixed(1) : null);
    }).catch(() => {});
    userSkillService.getMySkills().then(({ data }) => setUserSkills(data)).catch(() => {});
    skillService.list().then(({ data }) => setAllSkills(data)).catch(() => {});
    setBio(user.bio || "");
    setLocation(user.location || "");
    setLevel(user.level || "");
  }, [user?.id]);

  const skillsOfferte = userSkills.filter((s) => s.type === "offered");
  const skillsCercate = userSkills.filter((s) => s.type === "wanted");

  const filteredOfferte = skillsOfferte.filter((s) =>
    s.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCercate = skillsCercate.filter((s) =>
    s.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [filterType, setFilterType] = useState<"tutti" | "offered" | "wanted">("tutti");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    try {
      await authService.updateProfile({ bio, location, name: user.name });
      setIsModified(false);
    } catch {}
  };

  const handleAddSkill = async () => {
    if (!newSkillName) return;
    try {
      await userSkillService.addSkill({
        skill_name: newSkillName,
        level: newSkillLevel,
        type: newSkillType,
      });
      const { data } = await userSkillService.getMySkills();
      setUserSkills(data);
      setShowAddPopup(false);
      setNewSkillName("");
    } catch {}
  };

  const handleRemoveSkill = async (usId: number) => {
    try {
      await userSkillService.removeSkill(usId);
      setUserSkills((prev) => prev.filter((s) => s.id !== usId));
    } catch {}
  };

  const levelColors: Record<string, string> = {
    Principiante: "bg-yellow-100 text-yellow-800",
    Intermedio: "bg-blue-100 text-blue-800",
    Avanzato: "bg-green-100 text-green-800",
  };

  return (
    <div className="min-h-screen bg-black p-6 flex justify-center items-start text-white">
      <div className="w-full max-w-5xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-black rounded-3xl border border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)] p-6 lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden border-4 border-orange-500">
                <img src={user?.image_url || "https://cdn.phototourl.com/free/2026-05-12-bac6185b-c4fb-44db-bc6e-99673f2d71cd.jpg"} alt="profile" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-3xl font-semibold mt-4 text-white">{user?.name ?? "Username"}</h1>

              <input value={location} onChange={(e) => { setLocation(e.target.value); setIsModified(true); }} placeholder="Inserisci la tua città" className="mt-2 w-full bg-black border border-orange-500/30 rounded-xl px-3 py-2 text-white text-sm text-center outline-none focus:border-orange-500 placeholder:text-orange-500/30" />
              <select value={level} onChange={(e) => { setLevel(e.target.value); setIsModified(true); }} className="mt-2 w-full bg-black border border-orange-500/30 rounded-xl px-3 py-2 text-white text-sm text-center outline-none focus:border-orange-500">
                <option value="">Seleziona livello</option>
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzato">Avanzato</option>
              </select>

              <div className="mt-5 w-full">
                <h2 className="text-xl font-semibold text-left">Bio</h2>
                <textarea value={bio} onChange={(e) => { setBio(e.target.value); setIsModified(true); }} placeholder="Scrivi una breve bio..." className="w-full min-h-[100px] rounded-2xl border border-orange-500 bg-black p-3 text-white outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-orange-500/50 resize-none mt-2" />
              </div>

              {isModified ? (
                <button onClick={handleSaveProfile} className="mt-5 w-full bg-orange-500 text-black py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all">Salva Profilo</button>
              ) : (
      <button onClick={() => navigate("/")} className="mt-5 w-full flex items-center justify-center gap-2 bg-black text-orange-500 border-2 border-orange-500 py-3 rounded-2xl font-bold hover:bg-orange-500 hover:text-black transition-all">Indietro</button>
            )}
              <button onClick={handleLogout} className="mt-3 w-full flex items-center justify-center gap-2 border border-red-500/40 bg-red-500/10 text-red-400 py-3 rounded-2xl font-bold hover:bg-red-500/20 transition-all">
                <LogOut size={18} /> Esci
              </button>
          </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <br />
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cerca skill..." className="w-full bg-black border-2 border-orange-500 rounded-2xl p-3 pl-11 pr-72 text-white outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-orange-500/30" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <label className="flex items-center gap-1 text-zinc-300 cursor-pointer text-sm whitespace-nowrap">
                  <input type="radio" name="filterType" checked={filterType === "tutti"} onChange={() => setFilterType("tutti")} className="accent-orange-500" /> Tutti
                </label>
                <label className="flex items-center gap-1 text-zinc-300 cursor-pointer text-sm whitespace-nowrap">
                  <input type="radio" name="filterType" checked={filterType === "offered"} onChange={() => setFilterType("offered")} className="accent-orange-500" /> Offerte
                </label>
                <label className="flex items-center gap-1 text-zinc-300 cursor-pointer text-sm whitespace-nowrap">
                  <input type="radio" name="filterType" checked={filterType === "wanted"} onChange={() => setFilterType("wanted")} className="accent-orange-500" /> Cercate
                </label>
              </div>
            </div>

            {(filterType === "tutti" || filterType === "offered") && (
              <div className="bg-black rounded-3xl border-2 !border-orange-500 p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Skill Offerte</h2>
                    <p className="text-zinc-500 text-sm">Competenze che puoi offrire</p>
                  </div>
                  <button onClick={() => { setNewSkillType("offered"); setShowAddPopup(true); }} className="bg-orange-500 text-black px-5 py-2 rounded-xl font-bold hover:bg-orange-600 transition">+ Aggiungi</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {filteredOfferte.length === 0 && <p className="text-zinc-500 text-sm">Nessuna skill offerta.</p>}
                  {filteredOfferte.map((us) => (
                    <div key={us.id} className="flex items-center gap-3 bg-zinc-900 border !border-orange-500/30 px-4 py-3 rounded-2xl">
                      <div>
                        <p className="font-medium text-white">{us.skill_name}</p>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${levelColors[us.level] || ""}`}>{us.level}</span>
                      </div>
                      <button onClick={() => handleRemoveSkill(us.id)} className="text-red-500 hover:text-red-400 text-sm font-bold ml-2">Rimuovi</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(filterType === "tutti" || filterType === "wanted") && (
              <div className="bg-black rounded-3xl border-2 !border-orange-500 p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Skill Cercate</h2>
                    <p className="text-zinc-500 text-sm">Competenze che vuoi imparare</p>
                  </div>
                  <button onClick={() => { setNewSkillType("wanted"); setShowAddPopup(true); }} className="bg-orange-500 text-black px-5 py-2 rounded-xl font-bold hover:bg-orange-600 transition">+ Aggiungi</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {filteredCercate.length === 0 && <p className="text-zinc-500 text-sm">Nessuna skill cercata.</p>}
                  {filteredCercate.map((us) => (
                    <div key={us.id} className="flex items-center gap-3 bg-zinc-900 border !border-orange-500/30 px-4 py-3 rounded-2xl">
                      <div>
                        <p className="font-medium text-white">{us.skill_name}</p>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${levelColors[us.level] || ""}`}>{us.level}</span>
                      </div>
                      <button onClick={() => handleRemoveSkill(us.id)} className="text-red-500 hover:text-red-400 text-sm font-bold ml-2">Rimuovi</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-black rounded-3xl border-2 !border-orange-500 p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Feedback ricevuti</h2>
                  <p className="text-zinc-500 text-sm">Cosa dicono di te</p>
                </div>
              </div>
              {feedbacks.length === 0 ? (
                <p className="text-zinc-500 text-sm">Nessun feedback ancora.</p>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-orange-500/20">
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
                          <span className="text-sm font-medium text-zinc-300">{fb.reviewer_name || "Anonimo"}</span>
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
        </div>
      </div>

      {showAddPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="w-[500px]">
            <div className="bg-black rounded-3xl border-2 border-orange-500 p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-orange-500">
                Aggiungi Skill {newSkillType === "offered" ? "Offerta" : "Cercata"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} className="bg-black border-2 border-orange-500 rounded-2xl p-3 text-white outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="" className="bg-black text-white">Seleziona skill...</option>
                  {allSkills.map((s) => (
                    <option key={s.id} value={s.name} className="bg-black text-white">{s.name}</option>
                  ))}
                </select>
                <select value={newSkillLevel} onChange={(e) => setNewSkillLevel(e.target.value)} className="bg-black border-2 border-orange-500 rounded-2xl p-3 text-white outline-none focus:ring-2 focus:ring-orange-400">
                  <option className="bg-black text-white">Principiante</option>
                  <option className="bg-black text-white">Intermedio</option>
                  <option className="bg-black text-white">Avanzato</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleAddSkill} className="flex-1 bg-orange-500 text-black py-3 rounded-2xl font-bold hover:bg-orange-600 transition">Salva Skill</button>
                <button onClick={() => { setShowAddPopup(false); setNewSkillName(""); }} className="flex-1 bg-zinc-800 text-white py-3 rounded-2xl font-bold hover:bg-zinc-700 transition border border-orange-500/20">Annulla</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
