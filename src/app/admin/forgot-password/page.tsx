import type { Metadata } from "next";
import { AuthShell } from "../login/auth-shell";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = { title: { absolute: "Forgot Password | High Horizon Marketing" }, robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Forgot your password?" subtitle="Enter your admin email and we'll send you a link to reset it.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
