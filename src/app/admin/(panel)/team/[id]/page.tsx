import { notFound } from "next/navigation";
import { PageTitle } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { TeamForm } from "../team-form";

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const member = await prisma.teamMember.findUnique({ where: { id: (await params).id } });
  if (!member) notFound();
  return (
    <div>
      <PageTitle title={`Edit: ${member.name}`} />
      <TeamForm member={member} />
    </div>
  );
}
