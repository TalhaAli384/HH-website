import { PageTitle } from "@/components/admin/ui";
import { TeamForm } from "../team-form";

export default function NewTeamMemberPage() {
  return (
    <div>
      <PageTitle title="New team member" />
      <TeamForm />
    </div>
  );
}
