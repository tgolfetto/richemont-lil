import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { completionByMarket, monthlyActivity } from "@/lib/mock-data";
import { LearningActivityChart, MarketCompletionChart } from "@/components/analytics-charts";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Analytics"
        title="Regional learning intelligence"
        description="Use the prototype to tell a credible business case story with charts that feel executive-ready."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-3xl">Monthly engagement</CardTitle>
            <CardDescription>Assigned and completed learning activity over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <LearningActivityChart data={monthlyActivity} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-3xl">Market completion</CardTitle>
            <CardDescription>Completion performance across key APAC markets.</CardDescription>
          </CardHeader>
          <CardContent>
            <MarketCompletionChart data={completionByMarket} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

