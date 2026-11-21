import { PageTitle } from "@/components/admin/ui";
import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <div>
      <PageTitle title="New project" description="Add project details, a cover image and optional gallery images." />
      <ProjectForm />
    </div>
  );
}
