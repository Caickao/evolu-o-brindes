"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToastStore } from "@/store/toast-store";

export function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const push = useToastStore((s) => s.push);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Não foi possível criar sua conta.");
        return;
      }

      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInRes?.error) {
        push({ title: "Conta criada! Faça login para continuar.", variant: "success" });
        router.push("/login");
        return;
      }

      push({ title: "Conta criada com sucesso!", variant: "success" });
      router.push("/conta");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Nome Completo</label>
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-brand-gold">
          <User className="h-4 w-4 text-gray-400" />
          <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Seu nome completo" className="w-full text-sm outline-none" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-brand-gold">
          <Mail className="h-4 w-4 text-gray-400" />
          <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="seu@email.com" className="w-full text-sm outline-none" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Telefone</label>
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-brand-gold">
          <Phone className="h-4 w-4 text-gray-400" />
          <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(11) 99999-9999" className="w-full text-sm outline-none" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Senha</label>
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-brand-gold">
          <Lock className="h-4 w-4 text-gray-400" />
          <input type="password" required minLength={6} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" className="w-full text-sm outline-none" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Confirmar Senha</label>
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-brand-gold">
          <Lock className="h-4 w-4 text-gray-400" />
          <input type="password" required minLength={6} value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} placeholder="••••••••" className="w-full text-sm outline-none" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} fullWidth size="lg" className="mt-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Conta"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-semibold text-brand-gold-dark hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
