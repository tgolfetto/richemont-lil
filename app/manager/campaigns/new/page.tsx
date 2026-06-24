import { CampaignWizard } from "@/components/campaign-wizard";
import { getCampaignWizardSkills } from "@/lib/platform-data";

export default async function NewCampaignPage() {
  const skills = await getCampaignWizardSkills();

  return <CampaignWizard skillOptions={skills.map((skill) => skill.skill_name)} />;
}
