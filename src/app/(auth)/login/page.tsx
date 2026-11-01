import type { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoginBrand, LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <Card className="relative z-10 w-full max-w-sm shadow-lg">
      <CardHeader>
        <LoginBrand />
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
