import { notFound } from "next/navigation";
import { PageTitle } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "../service-form";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const service = await prisma.service.findUnique({ where: { id: (await params).id } });
  if (!service) notFound();
  return (
    <div>
      <PageTitle title={`Edit: ${service.title}`} />
      <ServiceForm service={service} />
    </div>
  );
}
