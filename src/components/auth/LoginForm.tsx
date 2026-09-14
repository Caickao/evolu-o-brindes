"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToastStore } from "@/store/toast-store";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const push = useToastStore((s) => s.push);
  const callbackUrl = searchParams.get("callbackUrl") || "/conta";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email ou senha inválidos.");
      return;
    }

    push({ title: "Login realizado com sucesso!", variant: "success" });
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-brand-gold">
          <Mail className="h-4 w-4 text-gray-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full text-sm outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Senha</label>
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-brand-gold">
          <Lock className="h-4 w-4 text-gray-400" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-sm outline-none"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} fullWidth size="lg" className="mt-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
      </Button>

      <p className="mt-2 rounded-lg bg-brand-ivory p-3 text-center text-xs text-gray-500">
        Conta de demonstração: <strong>cliente@exemplo.com</strong> / senha <strong>123456</strong>
      </p>

      <p className="text-center text-sm text-gray-500">
        Não tem uma conta?{" "}
        <Link href="/cadastro" className="font-semibold text-brand-gold-dark hover:underline">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
