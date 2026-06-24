import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/section-heading";
import { getCampaignListData } from "@/lib/platform-data";
import Link from "next/link";

export default async function CampaignsPage() {
  const campaigns = await getCampaignListData();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Campaigns"
        title="Program portfolio"
        description="Manage the regional learning journeys driving capability uplift across stores, markets, and leadership cohorts."
      />

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="font-display text-3xl">Published campaigns</CardTitle>
            <CardDescription>Everything currently active in the recommendation engine.</CardDescription>
          </div>
          <Link
            href="/manager/campaigns/new"
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-white"
          >
            New campaign
          </Link>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="rounded-[1.5rem] border border-zinc-200 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-zinc-950">{campaign.name}</h3>
                    <Badge className="border-gold-200 bg-gold-50 text-gold-800">{campaign.status}</Badge>
                  </div>
                  <p className="max-w-3xl text-sm leading-6 text-zinc-600">{campaign.description}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                    {campaign.target_role} · {campaign.target_market}
                  </p>
                </div>
                <div className="grid gap-2 text-sm text-zinc-600 md:text-right">
                  <p>
                    <span className="font-medium text-zinc-950">Start:</span> {campaign.start_date}
                  </p>
                  <p>
                    <span className="font-medium text-zinc-950">End:</span> {campaign.end_date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
