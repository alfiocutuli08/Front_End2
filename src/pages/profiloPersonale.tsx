import { useEffect, useState } from "react";
import { Search, ArrowLeft, Star } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { feedbackService } from "@/lib/services";
import type { Feedback } from "@/lib/types";

export default function profiloPersonale() {
    const { user } = useAuth();
    const [isModified, setIsModified] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [skillType, setSkillType] = useState("offerte");
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    useEffect(() => {
        if (user?.id) {
            feedbackService.getUserFeedback(user.id).then(({ data }) => setFeedbacks(data)).catch(() => {});
        }
    }, [user?.id]);

    const avgRating = feedbacks.length
        ? (feedbacks.reduce((a, f) => a + f.rating, 0) / feedbacks.length).toFixed(1)
        : null;
  // Array delle skill offerte dall'utente
  // Ogni skill ha:
  // - name = nome della skill
  // - level = livello esperienza
    const skillsOfferte=[
    { 
        name: "React",
        level: "Avanzato" 
    },
    { 
        name: "Python",
        level: "Intermedio" 
    },
    { 
        name: "UI Design",
        level: "Principiante" 
    },
  ];

  // Array delle skill che l'utente sta cercando
    const searchedSkills = [
    { 
        name: "Docker",
        level: "Intermedio" 
    },
    {
        name: "Cybersecurity", 
        level: "Principiante" 
    },
  ];

  // Oggetto che contiene i colori Tailwind CSS
  // associati ai livelli delle skill
    const levelColors: Record<string, string> = 
    {

        // Badge giallo
        Principiante: "bg-yellow-100 text-yellow-800",

        // Badge blu
        Intermedio: "bg-blue-100 text-blue-800",

        // Badge verde
        Avanzato: "bg-green-100 text-green-800",
    };

  // JSX della pagina
  return (
    // Contenitore principale
    // min-h-screen=altezza minima schermo intero
    // bg-slate-100=sfondo grigio chiaro
    // p-6=padding
    // flex=layout flexbox
    <div className="min-h-screen bg-black p-6 flex justify-center items-start text-white">

      {/* Contenitore centrale */}
      {/* max-w-5xl = larghezza massima */}
      {/* grid = layout a griglia */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ========================= */}
            {/* CARD PROFILO */}
            {/* ========================= */}
            <div className="bg-black rounded-3xl border border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)] p-6 lg:col-span-1">
                <div className="flex flex-col items-center text-center">
                    {/* FOTO PROFILO */}
                    <div className="w-32 h-32 rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden border-4 border-orange-500">
                        {/* Immagine utente */}
                        <img src="https://cdn.phototourl.com/free/2026-05-12-bac6185b-c4fb-44db-bc6e-99673f2d71cd.jpg" alt="profile"
                            // object-cover = riempie il contenitore
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Nome utente */}
                    <h1 className="text-3xl font-semibold">
                        {user?.name ?? "Username"}
                    </h1>
                    {/* Descrizione breve */}
                    <p className="text-slate-500 text-sm mt-1">
                        Lavoro • Luogo
                    </p>
                    {/* BIO */}
                    <div className="mt-5 w-full">
                        {/* Titolo bio */}
                        <h2 className="text-3xl font-semibold">
                            Bio
                        </h2>
                        {/* Textarea bio */}
                        <textarea
                            onChange={() => setIsModified(true)}
                            placeholder="Scrivi una breve bio..."
                            className="
                                w-full
                                min-h-[120px]
                                rounded-2xl
                                border
                                border-orange-500
                                bg-black
                                p-3
                                text-white
                                outline-none
                                focus:ring-2
                                focus:ring-orange-400
                                placeholder:text-orange-500/50 
                                resize-none
                            "
                        />
                    </div>
                    {/* Pulsante salva profilo */}
                    {isModified ? (
                        <button
                            className="
                                mt-5
                                w-full
                                bg-black
                                text-orange-500
                                border-2
                                border-orange-500
                                py-3
                                rounded-2xl
                                font-bold
                                hover:bg-orange-500
                                hover:text-black
                                transition-all
                            "
                        >
                            Salva Profilo
                        </button>

                    ) : (

                        <button
                            onClick={() => window.history.back()}
                            className="
                                mt-5
                                w-full
                                flex
                                items-center
                                justify-center
                                gap-2
                                bg-black
                                text-orange-500
                                border-2
                                border-orange-500
                                py-3
                                rounded-2xl
                                font-bold
                                hover:bg-orange-500
                                hover:text-black
                                transition-all
                            "
                        >
                            <ArrowLeft size={20} />
                            Indietro
                        </button>
                    )}
                </div>
            </div>
            {/* ========================= */}
            {/* SEZIONE SKILL */}
            {/* ========================= */}
            <div className="lg:col-span-2 space-y-4">
                <br />
                <div className="relative mb-1">
                    <input
                        type="text"
                        placeholder="Cerca skill..."
                        className="
                            w-full
                            mb-5
                            bg-black
                            border-2
                            border-orange-500
                            rounded-2xl
                            p-3
                            text-white
                            outline-none
                            focus:ring-2
                            focus:ring-orange-400
                            placeholder:text-orange-500/30
                        "
                    />  
                    <div className="absolute right-3 top-1/3 -translate-y-1/2 flex items-center gap-2">
                        <label className="flex items-center gap-1 text-[20] text-orange-500">
                            <input type="radio" name="skillType" checked={skillType === "offerte"} onChange={() => setSkillType("offerte")}  className="accent-orange-500"/>
                            Offerte
                        </label>
                        <label className="flex items-center gap-1 text-[20] text-orange-500">
                            <input type="radio" name="skillType" checked={skillType === "cercate"} onChange={() => setSkillType("cercate")} className="accent-orange-500" />
                            Cercate
                        </label>
                        <Search size={20} className="text-orange-500" />
                    </div> 
                </div>
                {/* SKILL OFFERTE */}
                <div className="bg-black rounded-3xl border-2 !border-orange-500 p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Skill Offerte</h2>
                            <p className="text-zinc-500 text-sm">Competenze che puoi offrire</p>
                        </div>
                        <button
                            onClick={() => {setShowPopup(true); setIsModified(true)}}
                            className="bg-orange-500 text-black px-5 py-2 rounded-xl font-bold hover:bg-orange-600 transition">
                            + Aggiungi
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {skillsOfferte.map((skill, index) => (
                            <div key={index} className="flex items-center gap-3 bg-zinc-900 border !border-orange-500/30 px-4 py-3 rounded-2xl">
                                <div>
                                    <p className="font-medium text-white">{skill.name}</p>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${levelColors[skill.level]}`}>
                                        {skill.level}
                                    </span>
                                </div>
                                <button className="text-red-500 hover:text-red-400 text-sm font-bold ml-2">Rimuovi</button>
                            </div>
                            ))
                        }
                    </div>
                </div>
                {/* SKILL CERCATE */}
                <div className="bg-black rounded-3xl border-2 !border-orange-500 p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Skill Cercate</h2>
                            <p className="text-zinc-500 text-sm">Competenze che vuoi imparare</p>
                        </div>
                        <button
                            onClick={() => {setShowPopup(true); setIsModified(true)}}
                            className="bg-orange-500 text-black px-5 py-2 rounded-xl font-bold hover:bg-orange-600 transition">
                            + Aggiungi
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {searchedSkills.map((skill, index) => (
                            <div key={index} className="flex items-center gap-3 bg-zinc-900 border !border-orange-500/30 px-4 py-3 rounded-2xl">
                                <div>
                                    <p className="font-medium text-white">{skill.name}</p>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${levelColors[skill.level]}`}>
                                        {skill.level}
                                    </span>
                                </div>
                                <button className="text-red-500 hover:text-red-400 text-sm font-bold ml-2">Rimuovi</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FEEDBACK */}
            <div className="bg-black rounded-3xl border-2 !border-orange-500 p-6 shadow-lg lg:col-span-3">
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
        {showPopup && 
            (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="w-[500px]">

                        <div className="bg-black rounded-3xl border-2 border-orange-500 p-6 shadow-lg">

                            <h2 className="text-xl font-bold mb-4 text-orange-500">
                                Aggiungi Nuova Skill
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <input
                                    type="text"
                                    placeholder="Nome skill"
                                    className="
                                        bg-black
                                        border-2
                                        border-orange-500
                                        rounded-2xl
                                        p-3
                                        text-white
                                        outline-none
                                        focus:ring-2
                                        focus:ring-orange-400
                                        placeholder:text-orange-500/30
                                    "
                                />
                                <select className="
                                    bg-black
                                    border-2
                                    border-orange-500
                                    rounded-2xl
                                    p-3
                                    text-white
                                    outline-none
                                    focus:ring-2
                                    focus:ring-orange-400
                                ">
                                    <option className="bg-black text-white">
                                        Principiante
                                    </option>
                                    <option className="bg-black text-white">
                                        Intermedio
                                    </option>
                                    <option className="bg-black text-white">
                                        Avanzato
                                    </option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button className="
                                    flex-1
                                    bg-orange-500
                                    text-black
                                    py-3
                                    rounded-2xl
                                    font-bold
                                    hover:bg-orange-600
                                    transition
                                ">
                                    Salva Skill
                                </button>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="
                                        flex-1
                                        bg-zinc-800
                                        text-white
                                        py-3
                                        rounded-2xl
                                        font-bold
                                        hover:bg-zinc-700
                                        transition
                                        border
                                        border-orange-500/20
                                    "
                                >
                                    Annulla
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}