"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToastStore } from "@/store/toast-store";

const emptyForm = { name: "", email: "", phone: "", subject: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const push = useToastStore((s) => s.push);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      push({ title: "Mensagem enviada!", description: "Retornaremos o contato em breve.", variant: "success" });
      setForm(emptyForm);
    } catch {
      push({ title: "Não foi possível enviar sua mensagem", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-6 md:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input required placeholder="Seu nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-gold" />
        <input required type="email" placeholder="Seu email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-gold" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input placeholder="Telefone / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-gold" />
        <input placeholder="Assunto" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-gold" />
      </div>
      <textarea
        required
        rows={5}
        placeholder="Conte-nos sobre o seu projeto ou dúvida..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-gold"
      />
      <Button type="submit" disabled={loading} size="lg" className="self-start">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar Mensagem
      </Button>
    </form>
  );
}
