import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-navy px-4 text-center">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative">
        <p className="font-numeric text-[120px] leading-none font-extrabold text-gold sm:text-[180px]">404</p>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">This page is still under construction</h1>
        <p className="mx-auto mt-4 max-w-md text-white/70">The page you are looking for doesn&apos;t exist or has been moved.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">Back to Home</ButtonLink>
          <ButtonLink href="/contact" variant="outline-light" size="lg">Contact Us</ButtonLink>
        </div>
        <Link href="/projects" className="mt-8 inline-block text-sm text-white/60 underline-offset-4 hover:text-gold hover:underline">
          Or explore our projects →
        </Link>
      </div>
    </main>
  );
}
