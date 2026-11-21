import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "./auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: { absolute: "Admin Login | High Horizon Marketing" }, robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <AuthShell title="Admin sign in" subtitle="Enter your credentials to access the dashboard.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
