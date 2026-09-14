import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata: Metadata = { title: "Meus Dados" };

export default async function AccountPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });

  if (!user) return null;

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold">Meus Dados</h2>
      <ProfileForm initialName={user.name} email={user.email} initialPhone={user.phone || ""} />
    </div>
  );
}
