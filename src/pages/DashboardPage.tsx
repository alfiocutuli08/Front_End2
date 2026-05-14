import { LogOut, ShieldCheck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge className="mb-3 gap-2 bg-orange-500/20 text-orange-400 border-orange-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              Sessione attiva
            </Badge>
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Button>
            <Button
              variant="outline"
              onClick={() => { logout(); navigate("/login"); }}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Esci
            </Button>
          </div>
        </header>

        <div className="mt-8 bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-6">Profilo utente</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="text-sm text-zinc-500">Nome</div>
              <div className="mt-1 font-medium text-lg">{user?.name ?? "Caricamento..."}</div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="text-sm text-zinc-500">Email</div>
              <div className="mt-1 font-medium text-lg">{user?.email ?? "Caricamento..."}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
