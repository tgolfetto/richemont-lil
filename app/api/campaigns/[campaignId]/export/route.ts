import { getCampaignById } from "@/lib/platform-data";
import { NextRequest } from "next/server";

type ExportType = "details" | "users";

function toCsvRow(values: Array<string | number>) {
  return values
    .map((value) => {
      const escaped = String(value ?? "").replace(/"/g, "\"\"");
      return `"${escaped}"`;
    })
    .join(",");
}

function campaignProgress(startDate: string, endDate: string, status: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return status === "Published" ? 100 : 0;
  }
  const progress = ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  const { campaignId } = await params;
  const data = await getCampaignById(campaignId);

  if (!data) {
    return new Response("Campaign not found", { status: 404 });
  }

  const { campaign, users, courses, skills, relatedRecommendations, createdBy } = data;
  const type = (request.nextUrl.searchParams.get("type") ?? "details") as ExportType;
  const courseIdFilter = request.nextUrl.searchParams.get("courseId");
  const statusFilter = request.nextUrl.searchParams.get("status") as
    | "Assigned"
    | "In Progress"
    | "Completed"
    | null;

  if (type === "users") {
    const userMap = new Map(users.map((user) => [user.id, user]));
    const courseMap = new Map(courses.map((course) => [course.id, course]));
    const skillMap = new Map(skills.map((skill) => [skill.id, skill]));
    const rows = [
      toCsvRow([
        "Campaign ID",
        "Campaign Name",
        "Course ID",
        "Course Title",
        "Skill",
        "Status",
        "Employee ID",
        "Employee Name",
        "Email",
        "Job Title",
        "Market"
      ])
    ];

    const filteredRecommendations = relatedRecommendations.filter((recommendation) => {
      if (courseIdFilter && recommendation.course_id !== courseIdFilter) return false;
      if (statusFilter && recommendation.status !== statusFilter) return false;
      return true;
    });

    for (const recommendation of filteredRecommendations) {
      const user = userMap.get(recommendation.user_id);
      const course = courseMap.get(recommendation.course_id);
      if (!user || !course) continue;
      const skill = skillMap.get(course.skill_id);
      rows.push(
        toCsvRow([
          campaign.id,
          campaign.name,
          course.id,
          course.title,
          skill?.skill_name ?? "",
          recommendation.status,
          user.id,
          user.full_name,
          user.email,
          user.job_title,
          user.market
        ])
      );
    }

    return new Response(rows.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="campaign-${campaign.id}-users.csv"`
      }
    });
  }

  const assigned = relatedRecommendations.filter((entry) => entry.status === "Assigned").length;
  const inProgress = relatedRecommendations.filter((entry) => entry.status === "In Progress").length;
  const completed = relatedRecommendations.filter((entry) => entry.status === "Completed").length;
  const courseMap = new Map(courses.map((course) => [course.id, course]));
  const skillMap = new Map(skills.map((skill) => [skill.id, skill]));
  const courseStats = relatedRecommendations.reduce((map, recommendation) => {
    const current = map.get(recommendation.course_id) ?? {
      assigned: 0,
      inProgress: 0,
      completed: 0
    };
    if (recommendation.status === "Assigned") current.assigned += 1;
    if (recommendation.status === "In Progress") current.inProgress += 1;
    if (recommendation.status === "Completed") current.completed += 1;
    map.set(recommendation.course_id, current);
    return map;
  }, new Map<string, { assigned: number; inProgress: number; completed: number }>());
  const assignedCoursesBySkillRows = Array.from(courseStats.entries())
    .map(([courseId, stats]) => {
      const course = courseMap.get(courseId);
      if (!course) return null;
      const skillName = skillMap.get(course.skill_id)?.skill_name ?? "Unknown skill";
      return {
        skillName,
        courseId: course.id,
        courseTitle: course.title,
        assigned: stats.assigned,
        inProgress: stats.inProgress,
        completed: stats.completed,
        total: stats.assigned + stats.inProgress + stats.completed
      };
    })
    .filter((row): row is {
      skillName: string;
      courseId: string;
      courseTitle: string;
      assigned: number;
      inProgress: number;
      completed: number;
      total: number;
    } => Boolean(row))
    .sort((left, right) => {
      if (left.skillName === right.skillName) return right.total - left.total;
      return left.skillName.localeCompare(right.skillName);
    });
  const employeeCount = users.filter((user) => {
    if (user.role !== "employee") return false;
    if (campaign.target_market === "APAC") return true;
    return user.job_title === campaign.target_role || user.market === campaign.target_market;
  }).length;
  const rows = [
    toCsvRow(["Campaign ID", campaign.id]),
    toCsvRow(["Campaign Name", campaign.name]),
    toCsvRow(["Description", campaign.description]),
    toCsvRow(["Target Role", campaign.target_role]),
    toCsvRow(["Target Market", campaign.target_market]),
    toCsvRow(["Status", campaign.status]),
    toCsvRow(["Start Date", campaign.start_date]),
    toCsvRow(["End Date", campaign.end_date]),
    toCsvRow(["Created By", createdBy?.full_name ?? "Unknown"]),
    toCsvRow(["Employees in Scope", employeeCount]),
    toCsvRow(["Progress %", campaignProgress(campaign.start_date, campaign.end_date, campaign.status)]),
    toCsvRow(["Assigned", assigned]),
    toCsvRow(["In Progress", inProgress]),
    toCsvRow(["Completed", completed]),
    toCsvRow(["Total Recommendations", relatedRecommendations.length]),
    toCsvRow(["", ""]),
    toCsvRow(["Assigned courses per skill", ""]),
    toCsvRow([
      "Skill",
      "Course ID",
      "Course title",
      "Assigned",
      "In Progress",
      "Completed",
      "Total"
    ]),
    ...assignedCoursesBySkillRows.map((row) =>
      toCsvRow([
        row.skillName,
        row.courseId,
        row.courseTitle,
        row.assigned,
        row.inProgress,
        row.completed,
        row.total
      ])
    )
  ];

  return new Response(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="campaign-${campaign.id}-details.csv"`
    }
  });
}
