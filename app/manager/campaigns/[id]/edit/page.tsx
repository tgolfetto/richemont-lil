import { CampaignForm } from "@/components/campaign-form";
import { getCampaignById, toCampaignFormValues } from "@/lib/platform-data";
import Link from "next/link";
import { notFound } from "next/navigation";

type CampaignEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CampaignEditPage({ params }: CampaignEditPageProps) {
  const { id } = await params;
  const data = await getCampaignById(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-light text-[color:var(--color-text)]">
            {data.campaign.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{data.campaign.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/manager/campaigns/${data.campaign.id}`}
            className="inline-flex h-9 items-center rounded-none border border-primary bg-transparent px-4 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Back to detail
          </Link>
          <Link
            href="/manager/campaigns"
            className="inline-flex h-9 items-center rounded-none border border-primary bg-transparent px-4 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Back to campaigns
          </Link>
        </div>
      </div>

      <CampaignForm
        campaignId={data.campaign.id}
        campaign={toCampaignFormValues(data.campaign)}
        title="Edit campaign"
        description="Update campaign properties using the same structure as the campaign detail view."
        submitLabel="Save changes"
        readOnlyStatus={false}
        skillOptions={data.skills.map((skill) => skill.skill_name)}
      />
    </div>
  );
}
