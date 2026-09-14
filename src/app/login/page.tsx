import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta Evolução Brindes & Personalizados.",
};

export default function LoginPage() {
  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Entre na sua conta para acompanhar seus pedidos e favoritos.">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
