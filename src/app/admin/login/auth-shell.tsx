import Image from "next/image";
import type { ReactNode } from "react";

// Shared two-column layout for the admin sign-in, forgot-password and reset pages.
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-navy lg:block">
        <Image src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1600&q=75" alt="" fill priority sizes="50vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy/70 to-navy/40" />
        <div className="absolute inset-x-12 bottom-12 text-white">
          <Image src="/logo.png" alt="" width={96} height={96} className="mb-6 h-24 w-24" />
          <p className="eyebrow mb-4 !text-gold">High Horizon Marketing and Developers</p>
          <h1 className="text-4xl font-bold text-white">Building Dreams. Creating Landmarks.</h1>
          <p className="mt-4 max-w-md text-white/70">Manage projects, inquiries and website content from one secure dashboard.</p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-mist px-4 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-card sm:p-10">
          <Image src="/logo.png" alt="High Horizon Marketing" width={72} height={72} className="h-[72px] w-[72px]" />
          <h2 className="mt-6 text-2xl font-bold">{title}</h2>
          <p className="mt-1.5 text-muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </main>
  );
}
