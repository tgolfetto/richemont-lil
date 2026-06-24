import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/section-heading";
import { getEmployeeDashboardData } from "@/lib/platform-data";
import { getSessionUser } from "@/lib/session";
import { ArrowUpRight, CheckCircle2, Clock3, Sparkles } from "lucide-react";

export default async function EmployeeDashboardPage() {
  const session = await getSessionUser();
  const { journey, recommendations, profile, connectionStatus } = await getEmployeeDashboardData(
    session?.id
  );

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Employee dashboard"
        title={journey.title}
        description={journey.subtitle}
      />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-zinc-100 bg-gradient-to-r from-gold-50 to-white">
            <CardTitle className="font-display text-3xl">Your learning journey</CardTitle>
            <CardDescription>
              Personalized recommendations designed for your current role and market context.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500">Progress</p>
                <p className="mt-2 font-display text-5xl text-zinc-950">{journey.progress}%</p>
              </div>
              <div className="rounded-[1.5rem] border border-gold-200 bg-gold-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-gold-700">Next milestone</p>
                <p className="mt-2 text-sm font-medium text-zinc-950">{journey.nextMilestone}</p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-sm font-semibold text-zinc-950">Active learning path</p>
              <p className="mt-2 text-sm text-zinc-600">{journey.activePath}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {journey.skillMix.map((skill) => (
                <div key={skill.name} className="rounded-[1.35rem] border border-zinc-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-zinc-950">{skill.name}</p>
                    <p className="text-sm text-zinc-500">{skill.value}%</p>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-zinc-100">
                    <div className="h-2 rounded-full bg-zinc-950" style={{ width: `${skill.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-3xl">Snapshot</CardTitle>
            <CardDescription>Quick status and progress markers for the employee view.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {[
              { label: "Current status", value: connectionStatus, icon: CheckCircle2 },
              { label: "Pending time", value: `${Math.max(1, recommendations.filter((entry) => entry.status !== "Completed").length)} courses`, icon: Clock3 },
              { label: "Featured skill", value: journey.skillMix[0]?.name ?? profile.role, icon: Sparkles }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-[1.4rem] border border-zinc-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-zinc-500">{item.label}</p>
                      <p className="mt-2 font-semibold text-zinc-950">{item.value}</p>
                    </div>
                    <Icon className="h-5 w-5 text-gold-600" />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div id="recommendations" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-3xl">Recommended courses</CardTitle>
            <CardDescription>Selected LinkedIn Learning content mapped to your current capability needs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {recommendations.map((recommendation) => {
              return (
                <div
                  key={recommendation.id}
                  className="grid gap-4 rounded-[1.5rem] border border-zinc-200 p-5 md:grid-cols-[1.2fr_1.2fr_auto]"
                >
                  <div>
                    <p className="font-medium text-zinc-950">{recommendation.course.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{recommendation.course.short_description}</p>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-zinc-600">
                    <p>
                      <span className="font-medium text-zinc-950">Skill:</span>{" "}
                      {recommendation.course.skill.skill_name}
                    </p>
                    <p>
                      <span className="font-medium text-zinc-950">Level:</span> {recommendation.course.level}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Badge className="border-gold-200 bg-gold-50 text-gold-800">
                      View course
                      <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div id="profile" className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-display text-3xl">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-6 text-sm text-zinc-600">
            <p>Market: {profile.market}</p>
            <p>Role: {profile.role}</p>
            <p>Proficiency: {profile.proficiencyLevel}</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-3xl">Recommended next steps</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
            {["Complete current assignment", "Book coaching review", "Review clienteling module"].map(
              (item) => (
                <div key={item} className="rounded-[1.35rem] border border-zinc-200 p-4">
                  <p className="text-sm text-zinc-700">{item}</p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
