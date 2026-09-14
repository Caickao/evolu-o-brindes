"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`/produtos?${params.toString()}`);
  }

  return (
    <select
      id="sort"
      defaultValue={defaultValue}
      onChange={handleChange}
      className="rounded-full border border-gray-200 px-3 py-1.5 text-sm"
    >
      <option value="relevancia">Relevância</option>
      <option value="menor-preco">Menor preço</option>
      <option value="maior-preco">Maior preço</option>
      <option value="novidades">Novidades</option>
    </select>
  );
}
