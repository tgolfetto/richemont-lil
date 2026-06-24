import { getEmployeeDashboardData } from "@/lib/platform-data";
import { getSessionUser } from "@/lib/session";
import { getCourseMockImage } from "@/lib/course-visuals";
import Link from "next/link";

export default async function EmployeeDashboardPage() {
  const session = await getSessionUser();
  const { recommendations } = await getEmployeeDashboardData(
    session?.id
  );
  const inProgressCourses = recommendations.filter((entry) => entry.status === "In Progress");
  const assignedCourses = recommendations.filter((entry) => entry.status === "Assigned");
  const completedCourses = recommendations.filter((entry) => entry.status === "Completed");

  return (
    <div className="space-y-5 font-sans">
      <section className="space-y-2">
        <h2 className="font-display text-xl font-light text-[color:var(--color-text)]">Courses</h2>
        <div className="grid gap-2.5 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-2">
            <p className="text-xs text-zinc-500">In progress</p>
            {inProgressCourses.map((item) => (
              <div
                key={item.id}
                className="grid gap-2 rounded-none border border-zinc-200 bg-white p-3 md:grid-cols-[120px_1.8fr_1fr_auto]"
              >
                <img
                  src={getCourseMockImage(item.course.id)}
                  alt={item.course.title}
                  className="h-20 w-full rounded-none border border-zinc-200 object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-[color:var(--color-text)]">{item.course.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{item.course.skill.skill_name}</p>
                </div>
                <div className="text-xs text-zinc-500">
                  <p>Level: {item.course.level}</p>
                  <p className="mt-0.5">Language: {item.course.language}</p>
                  <p className="mt-0.5">Campaign: {item.campaign_name}</p>
                </div>
                <Link
                  href={item.course.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center rounded-none border border-primary bg-transparent px-3 text-[11px] font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  Watch
                </Link>
              </div>
            ))}
            {inProgressCourses.length === 0 ? (
              <p className="text-xs text-zinc-500">No in-progress courses.</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-zinc-500">Assigned</p>
            {assignedCourses.map((item) => (
              <div
                key={item.id}
                className="space-y-2 rounded-none border border-zinc-200 bg-white p-3"
              >
                <img
                  src={getCourseMockImage(item.course.id)}
                  alt={item.course.title}
                  className="h-20 w-full rounded-none border border-zinc-200 object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-[color:var(--color-text)]">{item.course.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{item.course.skill.skill_name}</p>
                </div>
                <div className="text-xs text-zinc-500">
                  <p>Level: {item.course.level}</p>
                  <p className="mt-0.5">Language: {item.course.language}</p>
                  <p className="mt-0.5">Campaign: {item.campaign_name}</p>
                </div>
                <Link
                  href={item.course.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center rounded-none border border-primary bg-transparent px-3 text-[11px] font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  Watch
                </Link>
              </div>
            ))}
            {assignedCourses.length === 0 ? (
              <p className="text-xs text-zinc-500">No assigned courses.</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-light text-[color:var(--color-text)]">Completed</h2>
        <div className="grid gap-2.5 lg:grid-cols-3">
          {completedCourses.slice(0, 3).map((item) => (
            <div key={item.id} className="rounded-none border border-zinc-200 bg-surface p-3">
              <img
                src={getCourseMockImage(item.course.id)}
                alt={item.course.title}
                className="h-20 w-full rounded-none border border-zinc-200 object-cover"
              />
              <p className="text-sm font-medium text-[color:var(--color-text)]">{item.course.title}</p>
              <p className="mt-1 text-xs text-zinc-500">{item.course.skill.skill_name}</p>
              <div className="mt-2 text-xs text-zinc-500">
                <p>Level: {item.course.level}</p>
                <p className="mt-0.5">Language: {item.course.language}</p>
                <p className="mt-0.5">Campaign: {item.campaign_name}</p>
              </div>
              <Link
                href={item.course.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex h-8 items-center rounded-none border border-primary bg-transparent px-3 text-[11px] font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Rewatch
              </Link>
            </div>
          ))}
          {completedCourses.length === 0 ? (
            <p className="text-xs text-zinc-500">No completed courses yet.</p>
          ) : null}
        </div>
      </section>

    </div>
  );
}
