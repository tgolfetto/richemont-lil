import { LearningActivityChart, MarketCompletionChart } from "@/components/analytics-charts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/section-heading";
import { getManagerDashboardData } from "@/lib/platform-data";
import { ArrowRight, ExternalLink, PencilLine, Plus, Users } from "lucide-react";
import Link from "next/link";

const activeLearnerHeat = [
  { label: "This week", value: "1,238" },
  { label: "Momentum", value: "+18%" },
  { label: "Campaign reach", value: "APAC-wide" }
];

export default async function ManagerDashboardPage() {
  const { kpis, monthlyActivity, completionByMarket, managerHighlights, activeCampaignRows } =
    await getManagerDashboardData();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Manager dashboard"
        title="Learning operations at a glance"
        description="A premium control center for tracking learner activation, campaign health, and recommendation coverage across the region."
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-zinc-200">
            <CardContent className="p-6">
              <p className="text-sm text-zinc-500">{kpi.label}</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="font-display text-5xl leading-none text-zinc-950">{kpi.value}</p>
                <span className="rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-xs font-medium text-gold-700">
                  {kpi.delta}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-3xl">Learning activity by month</CardTitle>
            <CardDescription>Assigned versus completed courses across the current campaign cycle.</CardDescription>
          </CardHeader>
          <CardContent>
            <LearningActivityChart data={monthlyActivity} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-3xl">Performance by market</CardTitle>
            <CardDescription>Completion rate snapshot for the APAC rollout.</CardDescription>
          </CardHeader>
          <CardContent>
            <MarketCompletionChart data={completionByMarket} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {managerHighlights.map((item) => (
          <Card key={item.title} className="bg-zinc-950 text-white">
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">{item.title}</p>
              <p className="mt-4 font-display text-4xl text-gold-300">{item.value}</p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 border-b border-zinc-100 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="font-display text-3xl">Active campaigns</CardTitle>
            <CardDescription>Published learning journeys currently live in the region.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm">
              <Users className="h-4 w-4" />
              View learners
            </Button>
            <Link
              href="/manager/campaigns/new"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" />
              Create campaign
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {activeCampaignRows.map((row) => (
            <div
              key={row.name}
              className="grid gap-4 rounded-[1.5rem] border border-zinc-200 bg-white px-5 py-4 md:grid-cols-[1.6fr_0.8fr_0.9fr_0.7fr_auto]"
            >
              <div>
                <p className="font-medium text-zinc-950">{row.name}</p>
                <p className="mt-1 text-sm text-zinc-500">{row.audience}</p>
              </div>
              <div className="flex items-center">
                <Badge className="border-gold-200 bg-gold-50 text-gold-800">{row.market}</Badge>
              </div>
              <div className="flex items-center">
                <Badge className="border-zinc-200 bg-zinc-100 text-zinc-700">{row.status}</Badge>
              </div>
              <div className="flex items-center text-sm font-medium text-zinc-950">{row.progress}%</div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm">
                  View
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <PencilLine className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {activeLearnerHeat.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-6">
              <p className="text-sm text-zinc-500">{item.label}</p>
              <p className="mt-3 font-display text-4xl text-zinc-950">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gold-50/60">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold-700">Next action</p>
            <p className="mt-2 font-medium text-zinc-950">
              Launch a new campaign for the Singapore boutique leadership cohort.
            </p>
          </div>
          <Link
            href="/manager/campaigns/new"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-medium text-white"
          >
            Start wizard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
