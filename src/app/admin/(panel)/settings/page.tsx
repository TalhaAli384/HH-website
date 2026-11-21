import { PageTitle } from "@/components/admin/ui";
import { getSetting } from "@/lib/settings";
import { ContentSettingsForm, PasswordForm } from "./settings-forms";

export default async function SettingsPage() {
  const [company, home, about] = await Promise.all([getSetting("company"), getSetting("home"), getSetting("about")]);
  return (
    <div>
      <PageTitle title="Settings" description="Company information, website content and your account." />
      <div className="space-y-6">
        <ContentSettingsForm company={company} home={home} about={about} />
        <PasswordForm />
      </div>
    </div>
  );
}
