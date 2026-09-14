import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddressManager } from "@/components/account/AddressManager";

export const metadata: Metadata = { title: "Meus Endereços" };

export default async function AddressesPage() {
  const session = await auth();
  const addresses = await prisma.address.findMany({
    where: { userId: session!.user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold">Meus Endereços</h2>
      <AddressManager initialAddresses={addresses} />
    </div>
  );
}
