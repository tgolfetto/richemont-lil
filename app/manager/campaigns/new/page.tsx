import { CampaignForm } from "@/components/campaign-form";
import { getCampaignWizardSkills } from "@/lib/platform-data";
import type { CampaignFormValues } from "@/lib/types";
import Link from "next/link";

export default async function NewCampaignPage() {
  const skills = await getCampaignWizardSkills();
  const initialCampaign: CampaignFormValues = {
    name: "New Campaign",
    description: "Define campaign scope, target audience, and learning outcomes.",
    target_role: "Boutique Management · Store Manager",
    target_market: "APAC",
    campaign_type: "Tailored" as const,
    industry_type: "Jewellery",
    target_levels: ["Manager", "Senior Manager"],
    target_languages: ["English"],
    skill_targets: skills.slice(0, 3).map((skill) => ({
      skill_name: skill.skill_name,
      proficiency: "Intermediate" as const
    })),
    status: "Draft" as const,
    start_date: "2026-07-01",
    end_date: "2026-12-31"
  };

  return (
    <div className="space-y-4">
      <div>
        <Link
          href="/manager/campaigns"
          className="inline-flex h-9 items-center rounded-none border border-primary bg-transparent px-4 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Back to campaigns
        </Link>
      </div>
      <CampaignForm
        campaign={initialCampaign}
        title="Create campaign"
        description="Use dropdown-driven targeting for all campaign properties, including skill proficiency by skill."
        submitLabel="Create campaign"
        readOnlyStatus={false}
        skillOptions={skills.map((skill) => skill.skill_name)}
      />
    </div>
  );
}
