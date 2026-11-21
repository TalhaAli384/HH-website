import { AdminProvider } from "@/components/site/admin-controls";
import { PageTransition } from "@/components/motion/page-transition";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { siteConfig } from "@/config/site";
import { getSetting } from "@/lib/settings";
import { absoluteUrl } from "@/lib/utils";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const company = await getSetting("company");

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: siteConfig.name,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: absoluteUrl("/logo.png"),
    image: siteConfig.ogImage,
    telephone: company.phone,
    email: company.email,
    address: { "@type": "PostalAddress", streetAddress: company.address },
    openingHours: company.hours,
    sameAs: [company.facebook, company.instagram, company.linkedin, company.youtube].filter(Boolean),
  };

  return (
    <AdminProvider>
      <a href="#main" className="sr-only z-[60] rounded-md bg-gold px-4 py-2 font-semibold text-navy focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Navbar phone={company.phone} />
      <main id="main">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer company={company} />
      <WhatsAppButton number={company.whatsapp} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
      />
    </AdminProvider>
  );
}
