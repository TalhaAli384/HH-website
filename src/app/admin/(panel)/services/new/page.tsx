import { PageTitle } from "@/components/admin/ui";
import { ServiceForm } from "../service-form";

export default function NewServicePage() {
  return (
    <div>
      <PageTitle title="New service" />
      <ServiceForm />
    </div>
  );
}
