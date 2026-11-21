import { notFound } from "next/navigation";
import { PageTitle } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "../testimonial-form";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const testimonial = await prisma.testimonial.findUnique({ where: { id: (await params).id } });
  if (!testimonial) notFound();
  return (
    <div>
      <PageTitle title={`Edit testimonial: ${testimonial.name}`} />
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
