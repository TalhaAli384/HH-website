import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "../login/auth-shell";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = { title: { absolute: "Reset Password | High Horizon Marketing" }, robots: { index: false, follow: false } };

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Choose a new password" subtitle="Use at least 10 characters, including a letter and a number.">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
