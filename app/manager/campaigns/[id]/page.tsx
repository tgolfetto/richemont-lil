import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignSkillCourses } from "@/components/campaign-skill-courses";
import { getCampaignById } from "@/lib/platform-data";
import Link from "next/link";
import { notFound } from "next/navigation";

type CampaignDetailPageProps = {
  params: Promise<{ id: string }>;
};

function metadataValue(description: string, label: string) {
  const match = description.match(new RegExp(`${label}:\\s*([^\\.]+)`, "i"));
  return match?.[1]?.trim() ?? null;
}

function parseList(description: string, label: string) {
  const value = metadataValue(description, label);
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

type SkillTarget = {
  skill_name: string;
  proficiency: "General" | "Beginner" | "Beginner + Intermediate" | "Intermediate" | "Advanced";
};

function parseSkillMatrix(description: string): SkillTarget[] {
  const raw = metadataValue(description, "Skill matrix");
  if (!raw) return [];
  return raw
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [skill_name, proficiency] = item.split("|").map((value) => value.trim());
      if (!skill_name || !proficiency) return null;
      if (!["General", "Beginner", "Beginner + Intermediate", "Intermediate", "Advanced"].includes(proficiency)) {
        return null;
      }
      return {
        skill_name,
        proficiency: proficiency as SkillTarget["proficiency"]
      };
    })
    .filter((entry): entry is SkillTarget => Boolean(entry));
}

function getCampaignType(description: string, campaignType?: unknown) {
  if (campaignType === "Exhaustive" || campaignType === "Tailored") return campaignType;
  const fromDescription = metadataValue(description, "Type");
  if (!fromDescription) return "Tailored";
  return fromDescription.toLowerCase() === "exhaustive" ? "Exhaustive" : "Tailored";
}

function getCampaignProgress(startDate: string, endDate: string, status: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return status === "Published" ? 100 : 0;
  }
  const progress = ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
}

function proficiencyMatchesCourseLevel(
  proficiency: SkillTarget["proficiency"],
  courseLevel: string
) {
  const normalized = courseLevel.toLowerCase();
  if (proficiency === "General") return true;
  if (proficiency === "Beginner") return normalized.includes("beginner");
  if (proficiency === "Beginner + Intermediate") {
    return normalized.includes("beginner") || normalized.includes("intermediate");
  }
  if (proficiency === "Intermediate") return normalized.includes("intermediate");
  if (proficiency === "Advanced") return normalized.includes("advanced");
  return true;
}

function buildLanguageCourseList<T>(
  courses: T[],
  campaignType: "Exhaustive" | "Tailored",
  targetCount = 10
) {
  if (campaignType === "Exhaustive") {
    return courses.map((course, index) => ({ course, sequence: index + 1 }));
  }
  if (courses.length === 0) return [];
  return Array.from({ length: targetCount }, (_, index) => ({
    course: courses[index % courses.length],
    sequence: index + 1
  }));
}

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { id } = await params;
  const data = await getCampaignById(id);

  if (!data) {
    notFound();
  }

  const { campaign, createdBy, campaignsCount, relatedRecommendations, courses, skills, users } = data;
  const assigned = relatedRecommendations.filter((entry) => entry.status === "Assigned").length;
  const inProgress = relatedRecommendations.filter((entry) => entry.status === "In Progress").length;
  const completed = relatedRecommendations.filter((entry) => entry.status === "Completed").length;

  const campaignType = getCampaignType(
    campaign.description,
    (campaign as { campaign_type?: string | null }).campaign_type
  );
  const industry = metadataValue(campaign.description, "Industry") ?? "Jewellery";
  const dbLanguages = (campaign as { target_languages?: string[] | null }).target_languages;
  const languages =
    Array.isArray(dbLanguages) && dbLanguages.length > 0
      ? dbLanguages
      : parseList(campaign.description, "Languages");
  const levels = parseList(campaign.description, "Employee levels");
  const skillProficiency = parseList(campaign.description, "Skill proficiency");
  const explicitFocusSkills = parseList(campaign.description, "Focus skills");
  const skillMatrix = parseSkillMatrix(campaign.description);
  const employeeCount = users.filter((user) => {
    if (user.role !== "employee") return false;
    if (campaign.target_market === "APAC") return true;
    return user.job_title === campaign.target_role || user.market === campaign.target_market;
  }).length;
  const progress = getCampaignProgress(campaign.start_date, campaign.end_date, campaign.status);

  const courseMap = new Map(courses.map((course) => [course.id, course]));
  const skillMap = new Map(skills.map((skill) => [skill.id, skill]));
  const recommendationStatsByCourse = relatedRecommendations.reduce((map, recommendation) => {
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
  const recommendationSkillNames = Array.from(
    new Set(
      relatedRecommendations
        .map((recommendation) => {
          const course = courseMap.get(recommendation.course_id);
          if (!course) return null;
          return skillMap.get(course.skill_id)?.skill_name ?? null;
        })
        .filter((value): value is string => Boolean(value))
    )
  );

  const focusSkillNames =
    explicitFocusSkills.length > 0
      ? explicitFocusSkills
      : recommendationSkillNames.length > 0
        ? recommendationSkillNames
        : skills.slice(0, 3).map((skill) => skill.skill_name);
  const campaignLanguages = languages.length > 0 ? languages : ["English"];
  const resolvedSkillTargets: SkillTarget[] =
    skillMatrix.length > 0
      ? skillMatrix
      : focusSkillNames.map((skill_name) => ({ skill_name, proficiency: "Intermediate" }));

  const recommendedCoursesBySkill = resolvedSkillTargets.map((target) => {
    const mappedSkill = skills.find((skill) => skill.skill_name.toLowerCase() === target.skill_name.toLowerCase());
    const skillCourses = mappedSkill
      ? courses.filter((course) => course.skill_id === mappedSkill.id)
      : [];
    const filteredByProficiency = skillCourses.filter((course) =>
      proficiencyMatchesCourseLevel(target.proficiency, course.level)
    );
    const effectiveSkillCourses = filteredByProficiency.length > 0 ? filteredByProficiency : skillCourses;
    const byLanguage = campaignLanguages.map((language) => {
      const generated = buildLanguageCourseList(effectiveSkillCourses, campaignType, 10);
      return {
        language,
        courses: generated.map(({ course, sequence }) => {
          const stats = recommendationStatsByCourse.get(course.id) ?? {
            assigned: 0,
            inProgress: 0,
            completed: 0
          };
          return {
            id: course.id,
            title: course.title,
            level: course.level,
            linkedin_url: course.linkedin_url,
            sequence,
            assigned: stats.assigned,
            inProgress: stats.inProgress,
            completed: stats.completed
          };
        })
      };
    });
    return {
      skillName: target.skill_name,
      proficiency: target.proficiency,
      totalCount: effectiveSkillCourses.length,
      byLanguage
    };
  });

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-light text-[color:var(--color-text)]">{campaign.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">{campaign.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/manager/campaigns/${campaign.id}/edit`}
            className="inline-flex h-9 items-center rounded-none border border-primary bg-transparent px-4 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Edit campaign
          </Link>
          <Link
            href="/manager/campaigns"
            className="inline-flex h-9 items-center rounded-none border border-primary bg-transparent px-4 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Back to campaigns
          </Link>
        </div>
      </div>

      <div className="rounded-none border border-zinc-200 bg-surface px-3 py-3">
        <div className="grid gap-2.5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
          <div className="text-center">
            <p className="text-xs text-zinc-500">Assigned</p>
            <p className="mt-1.5 font-display text-3xl leading-none text-primary">{assigned}</p>
          </div>
          <p className="text-center text-zinc-400">→</p>
          <div className="text-center">
            <p className="text-xs text-zinc-500">In progress</p>
            <p className="mt-1.5 font-display text-3xl leading-none text-primary">{inProgress}</p>
          </div>
          <p className="text-center text-zinc-400">→</p>
          <div className="text-center">
            <p className="text-xs text-zinc-500">Completed</p>
            <p className="mt-1.5 font-display text-3xl leading-none text-primary">{completed}</p>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <p className="text-xs text-zinc-500">
            Total recommendations: <span className="text-[color:var(--color-text)]">{relatedRecommendations.length}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-none border border-zinc-200 bg-white px-3 py-3 text-xs text-zinc-500">
          <p><span className="text-[color:var(--color-text)]">Role:</span> {campaign.target_role}</p>
          <p className="mt-1"><span className="text-[color:var(--color-text)]">Industry:</span> {industry}</p>
        </div>
        <div className="rounded-none border border-zinc-200 bg-white px-3 py-3 text-xs text-zinc-500">
          <p><span className="text-[color:var(--color-text)]">Languages:</span> {languages.length > 0 ? languages.join(", ") : "English"}</p>
          <p className="mt-1"><span className="text-[color:var(--color-text)]">Type:</span> {campaignType}</p>
        </div>
        <div className="rounded-none border border-zinc-200 bg-white px-3 py-3 text-xs text-zinc-500">
          <p><span className="text-[color:var(--color-text)]">Market:</span> {campaign.target_market}</p>
          <p className="mt-1"><span className="text-[color:var(--color-text)]">Completion:</span> {progress}% Completed</p>
        </div>
        <div className="rounded-none border border-zinc-200 bg-white px-3 py-3 text-xs text-zinc-500">
          <p><span className="text-[color:var(--color-text)]">Employees:</span> {employeeCount}</p>
          <p className="mt-1"><span className="text-[color:var(--color-text)]">Scope:</span> {campaignsCount} similar campaigns</p>
        </div>
        <div className="rounded-none border border-zinc-200 bg-white px-3 py-3 text-xs text-zinc-500 md:col-span-2">
          <p><span className="text-[color:var(--color-text)]">Employee levels:</span> {levels.length > 0 ? levels.join(", ") : "General"}</p>
          <p className="mt-1"><span className="text-[color:var(--color-text)]">Skill proficiency:</span> {skillProficiency.length > 0 ? skillProficiency.join(", ") : "General"}</p>
        </div>
        <div className="rounded-none border border-zinc-200 bg-white px-3 py-3 text-xs text-zinc-500 md:col-span-2">
          <p><span className="text-[color:var(--color-text)]">Timeline:</span> {campaign.start_date} to {campaign.end_date}</p>
          <p className="mt-1"><span className="text-[color:var(--color-text)]">Created by:</span> {createdBy?.full_name ?? "Unknown"}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-xl font-light text-[color:var(--color-text)]">Recommended courses by skill</h2>
        <div className="grid gap-2.5 lg:grid-cols-2">
          {recommendedCoursesBySkill.map((group) => (
            <CampaignSkillCourses
              key={group.skillName}
              skillName={group.skillName}
              proficiency={group.proficiency}
              byLanguage={group.byLanguage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
