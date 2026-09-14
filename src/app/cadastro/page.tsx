import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Criar Conta",
  description: "Crie sua conta na Evolução Brindes & Personalizados.",
};

export default function RegisterPage() {
  return (
    <AuthLayout title="Crie sua conta" subtitle="Cadastre-se para acompanhar pedidos, favoritos e receber ofertas exclusivas.">
      <RegisterForm />
    </AuthLayout>
  );
}
