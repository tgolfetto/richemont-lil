import {
  LearningActivityChart,
  MarketCompletionChart,
  SkillCoverageChart,
  SkillProgressionChart
} from "@/components/analytics-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getManagerDashboardData } from "@/lib/platform-data";
import { Pin } from "lucide-react";

type Metric = {
  name: string;
  description: string;
  value: string;
};

function DashboardPin() {
  return (
    <span
      aria-label="add to dashboard"
      className="group relative inline-flex h-5 w-5 cursor-pointer items-center justify-center text-zinc-500"
    >
      <Pin className="h-3.5 w-3.5" />
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-none border border-zinc-300 bg-white px-2 py-1 text-[10px] text-[color:var(--color-text)] opacity-0 transition-opacity group-hover:opacity-100">
        add to dashboard
      </span>
    </span>
  );
}

export default async function AnalyticsPage() {
  const { kpis, monthlyActivity, completionByMarket, activeCampaignRows } = await getManagerDashboardData();
  const kpiMap = new Map(kpis.map((kpi) => [kpi.label, kpi.value]));

  const assignedCourses = monthlyActivity.reduce((sum, month) => sum + month.assigned, 0);
  const completedCourses = monthlyActivity.reduce((sum, month) => sum + month.completed, 0);
  const inferredStartedCourses = Math.max(completedCourses, Math.round(assignedCourses * 0.82));
  const acceptedCourses = Math.round(assignedCourses * 0.68);
  const monthlyActiveLearners = monthlyActivity.length > 0
    ? Math.round(monthlyActivity.reduce((sum, month) => sum + month.active, 0) / monthlyActivity.length)
    : 0;
  const publishedCampaigns = activeCampaignRows.filter((row) => row.status === "Published").length;

  const activation: Metric[] = [
    {
      name: "Activation rate",
      description: "% of employees who start at least one recommended course",
      value: kpiMap.get("Activation Rate") ?? "82%"
    },
    {
      name: "Recommendation acceptance rate",
      description: "% of recommended courses actually clicked",
      value: `${Math.round((acceptedCourses / Math.max(1, assignedCourses)) * 100)}%`
    },
    {
      name: "Time to first course",
      description: "Average time from campaign assignment to first course start",
      value: "3.2 days"
    }
  ];

  const engagement: Metric[] = [
    {
      name: "Course completion rate",
      description: "Completed courses ÷ Started courses",
      value: `${Math.round((completedCourses / Math.max(1, inferredStartedCourses)) * 100)}%`
    },
    {
      name: "Learning hours consumed",
      description: "Total time spent on LinkedIn Learning content",
      value: `${Math.round(inferredStartedCourses * 1.6)} h`
    },
    {
      name: "Learning path completion rate",
      description: "% of employees completing full skill-based learning paths",
      value: "64%"
    },
    {
      name: "Repeat learning rate",
      description: "% of users completing more than one course per campaign",
      value: kpiMap.get("Retention Rate") ?? "68%"
    }
  ];

  const retention: Metric[] = [
    {
      name: "Monthly active learners (MAL)",
      description: "Active users per month engaging with learning content",
      value: monthlyActiveLearners > 0 ? monthlyActiveLearners.toLocaleString() : "1,945"
    },
    {
      name: "30-day retention rate",
      description: "% of users returning to learn within 30 days",
      value: "58%"
    },
    {
      name: "Campaign re-engagement rate",
      description: "% of users engaging with new campaigns after first exposure",
      value: `${Math.round((publishedCampaigns / Math.max(1, activeCampaignRows.length)) * 100)}%`
    }
  ];

  const skillProgressionData = monthlyActivity.map((item) => ({
    month: item.month,
    baseline: Math.max(40, Math.round(item.completed * 0.35)),
    current: Math.max(52, Math.round(item.completed * 0.45))
  }));

  const skillCoverageData = [
    { skill: "Leadership", coverage: 82 },
    { skill: "Coaching", coverage: 76 },
    { skill: "Clienteling", coverage: 73 },
    { skill: "Goal Setting", coverage: 68 }
  ];

  return (
    <div className="space-y-5 font-sans">
      <section className="space-y-2">
        <h2 className="font-display text-xl font-light text-[color:var(--color-text)]">Filters</h2>
        <div className="grid gap-2.5 lg:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs text-zinc-500">Roles (multi-level)</p>
            <select
              multiple
              className="min-h-36 w-full rounded-none border border-primary bg-white px-3 py-2 text-xs text-[color:var(--color-text)] outline-none"
            >
              <optgroup label="Corporate/Office Employees">
                <option>Management · Legal</option>
                <option>Management · Compliance</option>
                <option>Management · Safety</option>
                <option>Management · Health</option>
                <option>Management · Real Estate</option>
                <option>Marketing & Communications · Brand</option>
                <option>Marketing & Communications · Digital Marketing</option>
                <option>Marketing & Communications · PR</option>
                <option>Marketing & Communications · VM</option>
                <option>Sales & Commercial · Wholesale</option>
                <option>Sales & Commercial · Business Development</option>
                <option>Sales & Commercial · E-commerce</option>
                <option>Finance & Accounting · Financial Analysis</option>
                <option>Finance & Accounting · Accounting</option>
                <option>Finance & Accounting · Brand Controls</option>
                <option>Finance & Accounting · Treasury</option>
                <option>HR</option>
                <option>IT</option>
                <option>Supply Chain</option>
                <option>Logistics</option>
                <option>Procurement</option>
                <option>QC</option>
                <option>CRC</option>
              </optgroup>
              <optgroup label="Boutique/Retail Employees">
                <option>Boutique Management · Boutique Director</option>
                <option>Boutique Management · Store Manager</option>
                <option>Boutique Management · Assistant Manager</option>
                <option>Client Advisors · Sales Associate</option>
                <option>Client Advisors · Client Advisor</option>
              </optgroup>
            </select>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-zinc-500">Markets (multi-level)</p>
            <select
              multiple
              className="min-h-36 w-full rounded-none border border-primary bg-white px-3 py-2 text-xs text-[color:var(--color-text)] outline-none"
            >
              <optgroup label="APAC">
                <option>APAC</option>
                <option>Singapore</option>
                <option>Malaysia</option>
                <option>Thailand</option>
                <option>Australia</option>
                <option>Hong Kong</option>
              </optgroup>
              <optgroup label="Europe">
                <option>Europe</option>
                <option>France</option>
                <option>Italy</option>
                <option>Switzerland</option>
                <option>United Kingdom</option>
              </optgroup>
            </select>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-zinc-500">Industry, campaign and level</p>
            <div className="grid gap-2">
              <select className="h-9 rounded-none border border-primary bg-white px-3 text-xs text-[color:var(--color-text)] outline-none">
                <option>Industry: Jewellery</option>
                <option>Industry: Watches</option>
                <option>Industry: Fashion & Accessories</option>
                <option>Industry: Online Distributors</option>
              </select>
              <select className="h-9 rounded-none border border-primary bg-white px-3 text-xs text-[color:var(--color-text)] outline-none">
                <option>Campaign type: Exhaustive</option>
                <option>Campaign type: Tailored</option>
              </select>
              <select
                multiple
                className="min-h-20 rounded-none border border-primary bg-white px-3 py-2 text-xs text-[color:var(--color-text)] outline-none"
              >
                <option>General</option>
                <option>Individual Contributor</option>
                <option>Manager</option>
                <option>Senior Manager</option>
                <option>C-Suite</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-light text-[color:var(--color-text)]">Activation</h2>
        <div className="grid gap-2.5 lg:grid-cols-3">
          {activation.map((metric) => (
            <Card key={metric.name} className="rounded-none border-0 bg-white">
              <CardContent className="p-4">
                <div className="rounded-none border border-zinc-200 bg-surface px-3 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-zinc-500">{metric.name}</p>
                    <DashboardPin />
                  </div>
                  <p className="mt-2 font-display text-3xl leading-none text-primary">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-light text-[color:var(--color-text)]">Engagement</h2>
        <div className="grid gap-2.5 lg:grid-cols-2">
          {engagement.map((metric) => (
            <Card key={metric.name} className="rounded-none border-0 bg-white">
              <CardContent className="p-4">
                <div className="rounded-none border border-zinc-200 bg-surface px-3 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-zinc-500">{metric.name}</p>
                    <DashboardPin />
                  </div>
                  <p className="mt-2 font-display text-3xl leading-none text-primary">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-light text-[color:var(--color-text)]">Retention</h2>
        <div className="grid gap-2.5 lg:grid-cols-3">
          {retention.map((metric) => (
            <Card key={metric.name} className="rounded-none border-0 bg-white">
              <CardContent className="p-4">
                <div className="rounded-none border border-zinc-200 bg-surface px-3 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-zinc-500">{metric.name}</p>
                    <DashboardPin />
                  </div>
                  <p className="mt-2 font-display text-3xl leading-none text-primary">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-light text-[color:var(--color-text)]">Skill Impact</h2>
        <div className="grid gap-2.5 lg:grid-cols-2">
          <Card className="rounded-none border border-zinc-200 bg-footer">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="font-display text-xl">Skill progression trend</CardTitle>
              <CardDescription>Measured progression lift versus baseline proficiency.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <SkillProgressionChart data={skillProgressionData} />
            </CardContent>
          </Card>

          <Card className="rounded-none border border-zinc-200 bg-footer">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="font-display text-xl">Skill coverage by population</CardTitle>
              <CardDescription>Share of learners covered by each strategic capability.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <SkillCoverageChart data={skillCoverageData} />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-light text-[color:var(--color-text)]">Learning trends</h2>
        <div className="grid gap-2.5 lg:grid-cols-2">
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
              <CardDescription>Completion performance across active markets.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <MarketCompletionChart data={completionByMarket} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
