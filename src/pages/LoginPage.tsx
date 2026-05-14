import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/services";
import { useAuth } from "@/lib/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await authService.login({ email, password });
      await login(data);
      navigate("/profile");
    } catch {
      setMessage("Credenziali non valide o backend non avviato.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md border-2 border-orange-500 bg-zinc-950 text-white shadow-[0_0_35px_rgba(249,115,22,0.22)]">
        <CardHeader>
          <CardTitle className="text-white">Login</CardTitle>
          <CardDescription className="text-zinc-400">
            Inserisci le credenziali del tuo account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-zinc-100">
              Email
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-orange-500" />
                <Input
                  className="border-orange-500/70 bg-black pl-10 text-white placeholder:text-zinc-500 focus-visible:ring-orange-500"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nome@email.com"
                  required
                />
              </div>
            </label>
            <label className="block text-sm font-medium text-zinc-100">
              Password
              <div className="relative mt-2">
                <LockKeyhole className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-orange-500" />
                <Input
                  className="border-orange-500/70 bg-black pl-10 text-white placeholder:text-zinc-500 focus-visible:ring-orange-500"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="La tua password"
                  required
                />
              </div>
            </label>
            {message && <p className="text-sm text-orange-300">{message}</p>}
            <Button
              className="w-full bg-orange-500 text-black hover:bg-orange-400"
              type="submit"
              disabled={loading}
            >
              {loading ? "Accesso..." : "Accedi"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-400">
            Non hai un account?{" "}
            <Link className="font-medium text-orange-400 hover:underline" to="/register">
              Registrati
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
