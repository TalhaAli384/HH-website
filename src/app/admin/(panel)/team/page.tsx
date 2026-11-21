import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deleteTeamMember } from "@/actions/team";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState, Flash, PageTitle, Pill, TableWrap } from "@/components/admin/ui";
import { departmentLabels } from "@/config/site";
import { prisma } from "@/lib/prisma";

export default async function AdminTeamPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const members = await prisma.teamMember.findMany({ orderBy: [{ department: "asc" }, { sortOrder: "asc" }] });

  return (
    <div>
      <PageTitle title="Team Members" description="People shown on the Our Team and About pages." action={{ href: "/admin/team/new", label: "New member" }} />
      <Flash show={saved === "1"} message="Team member saved successfully." />
      {members.length ? (
        <TableWrap>
          <thead>
            <tr><th>Member</th><th>Department</th><th>Order</th><th>Visibility</th><th className="text-right">Actions</th></tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-mist">
                      <Image src={m.photo} alt="" fill sizes="44px" className="object-cover" />
                    </div>
                    <div>
                      <Link href={`/admin/team/${m.id}`} className="font-semibold text-navy hover:text-gold-dark">{m.name}</Link>
                      <p className="text-xs text-muted">{m.position}</p>
                    </div>
                  </div>
                </td>
                <td>{departmentLabels[m.department]}</td>
                <td className="font-numeric text-muted">{m.sortOrder}</td>
                <td>{m.published ? <Pill tone="green">Published</Pill> : <Pill>Hidden</Pill>}</td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/team/${m.id}`} className="rounded-lg p-2 text-navy hover:bg-mist" aria-label={`Edit ${m.name}`}><Pencil className="h-4 w-4" /></Link>
                    <DeleteButton compact action={deleteTeamMember.bind(null, m.id)} label={`Delete ${m.name}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      ) : (
        <EmptyState message="No team members yet." action={{ href: "/admin/team/new", label: "Add a team member" }} />
      )}
    </div>
  );
}
