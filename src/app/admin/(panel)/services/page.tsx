import { Pencil, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deleteService } from "@/actions/services";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState, Flash, PageTitle, Pill, TableWrap } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

export default async function AdminServicesPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <PageTitle title="Services" description="Services shown on the home and services pages, in display order." action={{ href: "/admin/services/new", label: "New service" }} />
      <Flash show={saved === "1"} message="Service saved successfully." />
      {services.length ? (
        <TableWrap>
          <thead>
            <tr><th>Order</th><th>Service</th><th>Visibility</th><th className="text-right">Actions</th></tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td className="font-numeric font-bold text-muted">{s.sortOrder}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-mist">
                      <Image src={s.image} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/admin/services/${s.id}`} className="flex items-center gap-1.5 font-semibold text-navy hover:text-gold-dark">
                        {s.title} {s.featured && <Star className="h-3.5 w-3.5 fill-gold text-gold" />}
                      </Link>
                      <p className="max-w-md truncate text-xs text-muted">{s.summary}</p>
                    </div>
                  </div>
                </td>
                <td>{s.published ? <Pill tone="green">Published</Pill> : <Pill>Hidden</Pill>}</td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/services/${s.id}`} className="rounded-lg p-2 text-navy hover:bg-mist" aria-label={`Edit ${s.title}`}><Pencil className="h-4 w-4" /></Link>
                    <DeleteButton compact action={deleteService.bind(null, s.id)} label={`Delete ${s.title}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      ) : (
        <EmptyState message="No services yet." action={{ href: "/admin/services/new", label: "Add a service" }} />
      )}
    </div>
  );
}
