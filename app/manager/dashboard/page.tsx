import { LearningActivityChart, MarketCompletionChart } from "@/components/analytics-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getManagerDashboardData } from "@/lib/platform-data";
import Link from "next/link";

function marketToFlag(market: string) {
  const normalized = market
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
  const flags: Record<string, string> = {
    singapore: "🇸🇬",
    malaysia: "🇲🇾",
    thailand: "🇹🇭",
    australia: "🇦🇺",
    "hong kong": "🇭🇰",
    japan: "🇯🇵",
    france: "🇫🇷",
    italy: "🇮🇹",
    switzerland: "🇨🇭",
    "united kingdom": "🇬🇧",
    uk: "🇬🇧",
    "great britain": "🇬🇧",
    "united states": "🇺🇸",
    usa: "🇺🇸",
    us: "🇺🇸",
    canada: "🇨🇦",
    mexico: "🇲🇽",
    brazil: "🇧🇷",
    germany: "🇩🇪",
    spain: "🇪🇸",
    portugal: "🇵🇹",
    netherlands: "🇳🇱",
    poland: "🇵🇱",
    turkey: "🇹🇷",
    "united arab emirates": "🇦🇪",
    uae: "🇦🇪",
    china: "🇨🇳",
    india: "🇮🇳",
    apac: "🌏"
  };

  return flags[normalized] ?? market;
}

export default async function ManagerDashboardPage() {
  const { kpis, monthlyActivity, completionByMarket, managerHighlights, activeCampaignRows } =
    await getManagerDashboardData();
  const apacMarkets = new Set(["singapore", "malaysia", "thailand", "australia", "hong kong", "japan", "china", "india"]);
  const completionByApacMarket = completionByMarket.filter((item) =>
    apacMarkets.has(item.market.trim().toLowerCase())
  );
  const publishedCampaignRows = activeCampaignRows.filter((row) => row.status === "Published");
  const prioritySkill =
    managerHighlights.find((item) => item.title.toLowerCase().includes("priority skill")) ??
    managerHighlights[1] ??
    managerHighlights[0];
  const publishedCampaigns = publishedCampaignRows.length;
  const averageProgress = Math.round(
    publishedCampaignRows.reduce((sum, row) => sum + row.progress, 0) / Math.max(1, publishedCampaignRows.length)
  );
  const coveredMarkets = new Set(publishedCampaignRows.map((row) => row.market)).size;
  const campaignKpis = [
    { label: "Active campaigns", value: String(activeCampaignRows.length) },
    { label: "Published", value: String(publishedCampaigns) },
    { label: "Average progress", value: `${averageProgress}%` },
    { label: "Covered markets", value: String(coveredMarkets) }
  ];

  return (
    <div className="space-y-5 font-sans">
      <section className="space-y-2">
        <h2 className="font-display text-xl font-light text-[color:var(--color-text)]">Learnings at glance</h2>
        <div className="grid gap-2.5 lg:grid-cols-3">
          <Card className="rounded-none border-0 bg-white">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                {kpis.map((kpi) => (
                  <div key={kpi.label} className="rounded-none border border-zinc-200 bg-surface px-3 py-3">
                    <p className="text-xs text-zinc-500">{kpi.label}</p>
                    <p className="mt-1.5 font-display text-3xl leading-none text-[color:var(--color-text)]">{kpi.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none bg-surface">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="font-display text-xl">Learning activity by month</CardTitle>
              <CardDescription>Assigned versus completed courses in the current cycle.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <LearningActivityChart data={monthlyActivity} />
            </CardContent>
          </Card>

          <Card className="rounded-none bg-surface">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="font-display text-xl">Performance by market</CardTitle>
              <CardDescription>Completion rate snapshot for the ongoing rollout.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <MarketCompletionChart
                data={(completionByApacMarket.length > 0 ? completionByApacMarket : completionByMarket).map((item) => ({
                  ...item,
                  market: marketToFlag(item.market)
                }))}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-light text-[color:var(--color-text)]">Active campaigns</h2>
        <div className="grid gap-2.5 lg:grid-cols-3">
          <Card className="rounded-none border-0 bg-white">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                {campaignKpis.map((item) => (
                  <div key={item.label} className="rounded-none border border-zinc-200 bg-surface px-3 py-3">
                    <p className="text-xs text-zinc-500">{item.label}</p>
                    <p className="mt-1.5 font-display text-3xl leading-none text-[color:var(--color-text)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none bg-surface lg:col-span-2">
            <CardHeader className="flex flex-row items-end justify-between gap-2 border-b border-zinc-100 p-4 pb-2">
              <div>
                <CardTitle className="font-display text-xl">Campaign list</CardTitle>
                <CardDescription>Published learning journeys currently live in the region.</CardDescription>
              </div>
              <Link
                href="/manager/campaigns/new"
                className="inline-flex h-8 items-center rounded-none border border-primary bg-transparent px-3 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Create campaign
              </Link>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-3">
              {publishedCampaignRows.map((row) => (
                <div
                  key={row.name}
                  className="grid items-center gap-2 rounded-none border border-zinc-200 bg-white px-3 py-2.5 md:grid-cols-[1.8fr_auto_auto_auto_auto]"
                >
                  <div>
                    <p className="text-sm font-medium text-[color:var(--color-text)]">{row.name}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">{row.audience}</p>
                  </div>
                  <Badge title={row.market} className="rounded-none border-primary bg-white text-primary">
                    {marketToFlag(row.market)}
                  </Badge>
                  <Badge className="rounded-none border-zinc-300 bg-surface text-[color:var(--color-text)]">
                    {row.campaignType}
                  </Badge>
                  <p className="text-sm font-medium leading-none text-primary">{row.progress}% Completed</p>
                  <Link
                    href="/manager/campaigns"
                    className="inline-flex h-8 items-center rounded-none border border-primary bg-transparent px-3 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    View
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-light text-[color:var(--color-text)]">Insights</h2>
        <div className="grid gap-2.5 lg:grid-cols-3">
          <Card className="rounded-none border border-zinc-200 bg-footer">
            <CardContent className="p-4">
              <p className="mt-2 text-xs leading-5 text-[color:var(--color-text)]">
                {prioritySkill?.detail ?? "Most recommended capability for this quarter."}
              </p>
              <p className="mt-2 font-display text-2xl text-[color:var(--color-text)]">{prioritySkill?.value ?? "Coaching"}</p>
            </CardContent>
          </Card>

          <Card className="h-full rounded-none border border-zinc-200 bg-footer lg:col-span-2">
            <CardContent className="flex h-full items-center justify-center gap-3 p-4 text-center">
              <p className="text-sm font-medium text-[color:var(--color-text)]">
                Launch a new campaign for the Singapore boutique leadership cohort.
              </p>
              <Link
                href="/manager/campaigns/new"
                className="inline-flex h-9 items-center rounded-none border border-primary bg-transparent px-4 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Start wizard
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
