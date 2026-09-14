"use client";

import { useState } from "react";
import { MapPin, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToastStore } from "@/store/toast-store";

export type AddressData = {
  id: string;
  label: string;
  recipient: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
};

const emptyForm = {
  label: "Casa",
  recipient: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
};

export function AddressManager({ initialAddresses }: { initialAddresses: AddressData[] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const push = useToastStore((s) => s.push);

  async function addAddress() {
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, isDefault: addresses.length === 0 }),
    });
    const data = await res.json();
    if (!res.ok) {
      push({ title: data.error || "Erro ao salvar endereço", variant: "error" });
      return;
    }
    setAddresses((prev) => [...prev, data.address]);
    setForm(emptyForm);
    setShowForm(false);
    push({ title: "Endereço adicionado!", variant: "success" });
  }

  async function removeAddress(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    push({ title: "Endereço removido", variant: "info" });
  }

  async function setDefault(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    await fetch(`/api/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses.map((a) => (
        <div key={a.id} className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold-dark" />
            <div>
              <p className="flex items-center gap-2 font-semibold">
                {a.label} — {a.recipient}
                {a.isDefault && (
                  <span className="rounded-full bg-brand-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-gold-dark">
                    Padrão
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500">
                {a.street}, {a.number} {a.complement && `- ${a.complement}`} - {a.neighborhood}, {a.city}/{a.state} - {a.zipCode}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!a.isDefault && (
              <button onClick={() => setDefault(a.id)} className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-brand-gold-dark">
                <Star className="h-3.5 w-3.5" /> Tornar padrão
              </button>
            )}
            <button onClick={() => removeAddress(a.id)} className="text-gray-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm font-bold uppercase text-brand-gold-dark">
          <Plus className="h-4 w-4" /> Adicionar novo endereço
        </button>
      ) : (
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 p-5 sm:grid-cols-2">
          <input placeholder="Rótulo (Casa, Trabalho...)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input placeholder="Destinatário" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input placeholder="Rua" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm sm:col-span-2" />
          <input placeholder="Número" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input placeholder="Complemento" value={form.complement} onChange={(e) => setForm({ ...form, complement: e.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input placeholder="Bairro" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input placeholder="UF" maxLength={2} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input placeholder="CEP" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <div className="flex gap-2 sm:col-span-2">
            <Button onClick={addAddress} size="sm">Salvar Endereço</Button>
            <Button onClick={() => setShowForm(false)} size="sm" variant="ghost">Cancelar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
