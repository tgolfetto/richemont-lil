import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/section-heading";
import { getRecommendationRows } from "@/lib/platform-data";

export default async function RecommendationsPage() {
  const recommendations = await getRecommendationRows();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Recommendations"
        title="Assigned learning paths"
        description="Review how the platform maps employee profiles to learning content and status progression."
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-3xl">Recommendation queue</CardTitle>
          <CardDescription>Live assignments generated for the current employee base.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {recommendations.map((recommendation) => {
            return (
              <div
                key={recommendation.id}
                className="grid gap-4 rounded-[1.5rem] border border-zinc-200 p-5 md:grid-cols-[1fr_1.1fr_auto]"
              >
                <div>
                  <p className="font-semibold text-zinc-950">{recommendation.user.full_name}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {recommendation.user.job_title} · {recommendation.user.market}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-zinc-950">{recommendation.course.title}</p>
                  <p className="mt-1 text-sm text-zinc-600">{recommendation.course.short_description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    Skill: {recommendation.course.skill.skill_name}
                  </p>
                </div>
                <div className="flex items-start">
                  <Badge
                    className={
                      recommendation.status === "Completed"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : recommendation.status === "In Progress"
                          ? "border-gold-200 bg-gold-50 text-gold-800"
                          : "border-zinc-200 bg-zinc-100 text-zinc-700"
                    }
                  >
                    {recommendation.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
