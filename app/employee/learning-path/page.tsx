import { EmployeeLearningPath } from "@/components/employee-learning-path";
import { getEmployeeDashboardData } from "@/lib/platform-data";
import { getSessionUser } from "@/lib/session";

export default async function EmployeeLearningPathPage() {
  const session = await getSessionUser();
  const { journey, recommendations } = await getEmployeeDashboardData(session?.id);

  return (
    <div className="space-y-5 font-sans">
      <div className="rounded-none border border-zinc-200 bg-white p-4">
        <p className="text-xs text-zinc-500">Current milestones</p>
        <div className="mt-3 grid gap-2.5 lg:grid-cols-3">
          <div className="rounded-none border border-zinc-200 bg-surface p-3">
            <p className="text-xs text-zinc-500">Learning progress</p>
            <p className="mt-1 font-display text-3xl text-[color:var(--color-text)]">{journey.progress}%</p>
          </div>
          <div className="rounded-none border border-zinc-200 bg-surface p-3 lg:col-span-2">
            <p className="text-xs text-zinc-500">Next milestone</p>
            <p className="mt-1 text-sm text-[color:var(--color-text)]">{journey.nextMilestone}</p>
          </div>
        </div>
      </div>

      <EmployeeLearningPath
        recommendations={recommendations.map((item) => ({
          id: item.id,
          status: item.status,
          course: {
            id: item.course.id,
            title: item.course.title,
            level: item.course.level,
            short_description: item.course.short_description,
            linkedin_url: item.course.linkedin_url,
            skill: { skill_name: item.course.skill.skill_name }
          }
        }))}
        skillMix={journey.skillMix}
      />
    </div>
  );
}
