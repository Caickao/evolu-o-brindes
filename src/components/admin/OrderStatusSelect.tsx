"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToastStore } from "@/store/toast-store";
import { ORDER_STATUS_LABEL, ORDER_STATUS_OPTIONS } from "@/lib/order-status";

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const push = useToastStore((s) => s.push);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setValue(newStatus);
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    if (!res.ok) {
      push({ title: "Erro ao atualizar status", variant: "error" });
      setValue(status);
      return;
    }
    push({ title: "Status atualizado", variant: "success" });
    router.refresh();
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={loading}
      className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold"
    >
      {ORDER_STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
      ))}
    </select>
  );
}
