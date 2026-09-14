"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useToastStore } from "@/store/toast-store";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/ui/Button";
import { formatPrice, cn } from "@/lib/utils";

type Address = {
  id: string;
  label: string;
  recipient: string;
  street: string;
  number: string;
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

export default function CheckoutPage() {
  const { items, coupon, subtotal, discount, total, clearCart } = useCartStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [notes, setNotes] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const push = useToastStore((s) => s.push);
  const router = useRouter();
  const mounted = useMounted();

  useEffect(() => {
    fetch("/api/addresses")
      .then((r) => r.json())
      .then((data) => {
        setAddresses(data.addresses || []);
        const def = data.addresses?.find((a: Address) => a.isDefault) || data.addresses?.[0];
        if (def) setSelectedAddress(def.id);
        else setShowForm(true);
      })
      .finally(() => setLoadingAddresses(false));
  }, []);

  async function saveAddress() {
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
    setSelectedAddress(data.address.id);
    setShowForm(false);
    setForm(emptyForm);
    push({ title: "Endereço adicionado", variant: "success" });
  }

  async function confirmOrder() {
    if (!selectedAddress) {
      push({ title: "Selecione ou cadastre um endereço", variant: "error" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddress,
          couponCode: coupon?.code,
          customerNotes: notes,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            personalization: i.personalization,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        push({ title: data.error || "Não foi possível concluir o pedido", variant: "error" });
        return;
      }
      clearCart();
      router.push(`/pedido-confirmado/${data.order.number}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return <div className="container-page py-24" />;
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-lg font-semibold">Seu carrinho está vazio.</p>
        <Button href="/produtos" className="mt-4">Ver Produtos</Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="mb-8 font-display text-3xl font-bold md:text-4xl">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
              <MapPin className="h-5 w-5 text-brand-gold-dark" /> Endereço de Entrega
            </h2>

            {loadingAddresses ? (
              <p className="text-sm text-gray-500">Carregando endereços...</p>
            ) : (
              <div className="flex flex-col gap-3">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm",
                      selectedAddress === a.id ? "border-brand-gold bg-brand-gold/5" : "border-gray-200"
                    )}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === a.id}
                      onChange={() => setSelectedAddress(a.id)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">{a.label} — {a.recipient}</p>
                      <p className="text-gray-500">
                        {a.street}, {a.number} - {a.neighborhood}, {a.city}/{a.state} - {a.zipCode}
                      </p>
                    </div>
                  </label>
                ))}

                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 text-sm font-bold uppercase text-brand-gold-dark"
                  >
                    <Plus className="h-4 w-4" /> Adicionar novo endereço
                  </button>
                )}

                {showForm && (
                  <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 sm:grid-cols-2">
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
                      <Button onClick={saveAddress} size="sm">Salvar Endereço</Button>
                      <Button onClick={() => setShowForm(false)} size="sm" variant="ghost">Cancelar</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 font-display text-lg font-bold">Observações do Pedido</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Alguma observação especial sobre a produção ou entrega?"
              className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-brand-gold"
            />
          </section>
        </div>

        <div className="h-fit rounded-2xl border border-gray-100 p-6">
          <h2 className="mb-4 font-display text-lg font-bold">Resumo</h2>
          <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 text-sm text-gray-500">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between gap-2">
                <span className="line-clamp-1">{i.quantity}x {i.name}</span>
                <span className="shrink-0">{formatPrice(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 py-4 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal())}</span>
            </div>
            {discount() > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Desconto ({coupon?.code})</span>
                <span>-{formatPrice(discount())}</span>
              </div>
            )}
            <div className="flex justify-between font-display text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(total())}</span>
            </div>
          </div>
          <Button onClick={confirmOrder} disabled={submitting} fullWidth size="lg">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar Pedido"}
          </Button>
        </div>
      </div>
    </div>
  );
}
