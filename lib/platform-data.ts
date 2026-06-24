import { getSupabaseAdminClient, hasSupabaseConnection } from "@/lib/supabase";
import {
  completionByMarket as fallbackCompletionByMarket,
  kpis as fallbackKpis,
  managerHighlights,
  monthlyActivity as fallbackMonthlyActivity,
  mockCampaigns,
  mockCourses,
  mockRecommendations,
  mockSkills,
  mockUsers
} from "@/lib/mock-data";
import type { Campaign, Course, Recommendation, Skill, User } from "@/lib/types";

type ManagerCampaignRow = {
  name: string;
  market: string;
  audience: string;
  status: string;
  campaignType: "Exhaustive" | "Tailored";
  progress: number;
};

type RecommendationRow = {
  id: string;
  status: Recommendation["status"];
  user: Pick<User, "id" | "full_name" | "job_title" | "market">;
  course: Pick<Course, "id" | "title" | "short_description" | "level" | "linkedin_url"> & {
    skill: Pick<Skill, "id" | "skill_name">;
  };
};

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

function toMonthLabel(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return monthFormatter.format(date);
}

function getRollingMonths(count = 6) {
  const labels: string[] = [];
  const now = new Date();
  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    labels.push(monthFormatter.format(date));
  }
  return labels;
}

function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function calculateCampaignProgress(campaign: Campaign) {
  const start = new Date(campaign.start_date);
  const end = new Date(campaign.end_date);
  const now = new Date();

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return campaign.status === "Published" ? 100 : 0;
  }

  const progress = ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;
  return clampPercentage(progress);
}

function getCampaignType(campaign: Campaign) {
  const dbCampaign = campaign as Campaign & { campaign_type?: string | null };
  if (dbCampaign.campaign_type === "Exhaustive" || dbCampaign.campaign_type === "Tailored") {
    return dbCampaign.campaign_type;
  }

  const match = campaign.description.match(/Type:\s*(Exhaustive|Tailored)/i);
  if (match?.[1]) {
    return match[1].toLowerCase() === "exhaustive" ? "Exhaustive" : "Tailored";
  }

  return "Tailored";
}

function buildCampaignRows(campaigns: Campaign[]): ManagerCampaignRow[] {
  return [...campaigns]
    .sort((left, right) => right.start_date.localeCompare(left.start_date))
    .map((campaign) => ({
      name: campaign.name,
      market: campaign.target_market,
      audience: campaign.target_role,
      status: campaign.status,
      campaignType: getCampaignType(campaign),
      progress: calculateCampaignProgress(campaign)
    }));
}

function buildManagerKpis(users: User[], recommendations: Recommendation[]) {
  const employees = users.filter((user) => user.role === "employee");
  const activeLearners = new Set(recommendations.map((recommendation) => recommendation.user_id));
  const completed = recommendations.filter((recommendation) => recommendation.status === "Completed");
  const multiTouchLearners = employees.filter(
    (user) =>
      recommendations.filter((recommendation) => recommendation.user_id === user.id).length >= 2
  );

  return [
    { label: "Active Learners", value: String(employees.length), delta: `${clampPercentage((activeLearners.size / Math.max(1, employees.length)) * 100)}%` },
    {
      label: "Activation Rate",
      value: `${clampPercentage((activeLearners.size / Math.max(1, employees.length)) * 100)}%`,
      delta: `${activeLearners.size} learners`
    },
    {
      label: "Course Completion Rate",
      value: `${clampPercentage((completed.length / Math.max(1, recommendations.length)) * 100)}%`,
      delta: `${completed.length} completed`
    },
    {
      label: "Retention Rate",
      value: `${clampPercentage((multiTouchLearners.length / Math.max(1, employees.length)) * 100)}%`,
      delta: `${multiTouchLearners.length} repeat learners`
    }
  ];
}

function buildMonthlyActivity(recommendations: Recommendation[]) {
  const months = getRollingMonths(6);
  const totals = new Map(
    months.map((month) => [month, { month, assigned: 0, completed: 0, active: 0 }])
  );

  for (const recommendation of recommendations) {
    const month = toMonthLabel(recommendation.created_at);
    if (!month || !totals.has(month)) continue;
    const entry = totals.get(month);
    if (!entry) continue;
    entry.assigned += 1;
    if (recommendation.status === "Completed") {
      entry.completed += 1;
    }
  }

  return Array.from(totals.values());
}

function buildCompletionByMarket(users: User[], recommendations: Recommendation[]) {
  const markets = new Map<string, { market: string; completion: number; total: number }>();

  for (const recommendation of recommendations) {
    const user = users.find((entry) => entry.id === recommendation.user_id);
    if (!user) continue;
    const current = markets.get(user.market) ?? { market: user.market, completion: 0, total: 0 };
    current.total += 1;
    if (recommendation.status === "Completed") {
      current.completion += 1;
    }
    markets.set(user.market, current);
  }

  const sortedMarkets = Array.from(markets.values()).sort((left, right) => right.total - left.total);
  if (sortedMarkets.length === 0) {
    return fallbackCompletionByMarket;
  }

  return sortedMarkets.map((entry) => ({
    market: entry.market,
    completion: clampPercentage((entry.completion / Math.max(1, entry.total)) * 100)
  }));
}

function buildRecommendationRows(
  users: User[],
  courses: Course[],
  skills: Skill[],
  recommendations: Recommendation[]
): RecommendationRow[] {
  const userMap = new Map(users.map((user) => [user.id, user]));
  const courseMap = new Map(courses.map((course) => [course.id, course]));
  const skillMap = new Map(skills.map((skill) => [skill.id, skill]));

  return recommendations
    .map((recommendation) => {
      const user = userMap.get(recommendation.user_id);
      const course = courseMap.get(recommendation.course_id);
      if (!user || !course) return null;
      const skill = skillMap.get(course.skill_id);
      if (!skill) return null;

      return {
        id: recommendation.id,
        status: recommendation.status,
        user: {
          id: user.id,
          full_name: user.full_name,
          job_title: user.job_title,
          market: user.market
        },
        course: {
          id: course.id,
          title: course.title,
          short_description: course.short_description,
          level: course.level,
          linkedin_url: course.linkedin_url,
          skill: {
            id: skill.id,
            skill_name: skill.skill_name
          }
        }
      };
    })
    .filter((row): row is RecommendationRow => Boolean(row));
}

function buildEmployeeJourney(
  user: User | undefined,
  campaigns: Campaign[],
  courses: Course[],
  skills: Skill[],
  recommendations: Recommendation[]
) {
  if (!user) return null;
  const userRecommendations = recommendations.filter((recommendation) => recommendation.user_id === user.id);
  const completed = userRecommendations.filter((recommendation) => recommendation.status === "Completed");
  const nextRecommendation = userRecommendations.find((recommendation) => recommendation.status !== "Completed");
  const courseSkillCounts = new Map<string, number>();

  for (const recommendation of userRecommendations) {
    const course = courses.find((entry) => entry.id === recommendation.course_id);
    const skill = skills.find((entry) => entry.id === course?.skill_id);
    if (!skill) continue;
    courseSkillCounts.set(skill.skill_name, (courseSkillCounts.get(skill.skill_name) ?? 0) + 1);
  }

  const total = Math.max(1, userRecommendations.length);
  const skillMix = Array.from(courseSkillCounts.entries())
    .map(([name, count]) => ({ name, value: clampPercentage((count / total) * 100) }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 4);

  return {
    title: user.full_name,
    subtitle: `${user.job_title} · ${user.market}`,
    progress: clampPercentage((completed.length / total) * 100),
    nextMilestone: nextRecommendation
      ? `Complete ${courses.find((course) => course.id === nextRecommendation.course_id)?.title ?? "next course"}`
      : "Keep building on your learning journey",
    activePath: campaigns.find((campaign) => campaign.target_role === user.job_title)?.name ?? campaigns[0]?.name ?? "Learning journey",
    skillMix: skillMix.length > 0 ? skillMix : mockSkills.slice(0, 4).map((skill) => ({ name: skill.skill_name, value: 25 }))
  };
}

async function fetchLiveData() {
  const supabase = getSupabaseAdminClient();
  if (!supabase || !hasSupabaseConnection) {
    return null;
  }

  const [usersResult, campaignsResult, skillsResult, coursesResult, recommendationsResult] =
    await Promise.all([
      supabase.from("users").select("*").order("created_at", { ascending: false }),
      supabase.from("campaigns").select("*").order("start_date", { ascending: false }),
      supabase.from("skills").select("*").order("skill_name", { ascending: true }),
      supabase.from("courses").select("*").order("title", { ascending: true }),
      supabase.from("recommendations").select("*").order("created_at", { ascending: false })
    ]);

  if (
    usersResult.error ||
    campaignsResult.error ||
    skillsResult.error ||
    coursesResult.error ||
    recommendationsResult.error
  ) {
    return null;
  }

  return {
    users: (usersResult.data ?? []) as User[],
    campaigns: (campaignsResult.data ?? []) as Campaign[],
    skills: (skillsResult.data ?? []) as Skill[],
    courses: (coursesResult.data ?? []) as Course[],
    recommendations: (recommendationsResult.data ?? []) as Recommendation[]
  };
}

export async function getManagerDashboardData() {
  const live = await fetchLiveData();
  if (!live) {
    return {
      kpis: fallbackKpis,
      monthlyActivity: fallbackMonthlyActivity,
      completionByMarket: fallbackCompletionByMarket,
      activeCampaignRows: buildCampaignRows(mockCampaigns),
      managerHighlights
    };
  }

  return {
    kpis: buildManagerKpis(live.users, live.recommendations),
    monthlyActivity: buildMonthlyActivity(live.recommendations),
    completionByMarket: buildCompletionByMarket(live.users, live.recommendations),
    activeCampaignRows: buildCampaignRows(live.campaigns),
    managerHighlights
  };
}

export async function getCampaignListData() {
  const live = await fetchLiveData();
  if (!live) {
    return mockCampaigns;
  }

  return [...live.campaigns].sort((left, right) => right.start_date.localeCompare(left.start_date));
}

export async function getCampaignListWithStats() {
  const live = await fetchLiveData();
  const campaigns = (live?.campaigns ?? mockCampaigns).sort((left, right) =>
    right.start_date.localeCompare(left.start_date)
  );
  const users = live?.users ?? mockUsers;

  return campaigns.map((campaign) => {
    const inScopeUsers = users.filter((user) => {
      if (user.role !== "employee") return false;
      if (campaign.target_market === "APAC") return true;
      return user.job_title === campaign.target_role || user.market === campaign.target_market;
    });

    return {
      ...campaign,
      employeeCount: inScopeUsers.length
    };
  });
}

export async function getCampaignById(campaignId: string) {
  const live = await fetchLiveData();
  const campaigns = live?.campaigns ?? mockCampaigns;
  const courses = live?.courses ?? mockCourses;
  const skills = live?.skills ?? mockSkills;
  const campaign = campaigns.find((entry) => entry.id === campaignId);
  if (!campaign) return null;

  const users = live?.users ?? mockUsers;
  const campaignsCount = campaigns.filter(
    (entry) =>
      entry.target_market === campaign.target_market || entry.target_role === campaign.target_role
  ).length;
  const relatedRecommendations =
    live?.recommendations.filter((recommendation) => {
      const user = users.find((entry) => entry.id === recommendation.user_id);
      return user?.job_title === campaign.target_role || user?.market === campaign.target_market;
    }) ?? mockRecommendations.filter((recommendation) => {
      const user = mockUsers.find((entry) => entry.id === recommendation.user_id);
      return user?.job_title === campaign.target_role || user?.market === campaign.target_market;
    });

  return {
    campaign,
    users,
    courses,
    skills,
    campaignsCount,
    relatedRecommendations,
    createdBy: users.find((entry) => entry.id === campaign.created_by) ?? null
  };
}

export function toCampaignFormValues(campaign: Campaign) {
  const metadataValue = (label: string) => {
    const match = campaign.description.match(new RegExp(`${label}:\\s*([^\\.]+)`, "i"));
    return match?.[1]?.trim() ?? null;
  };
  const parseList = (label: string) => {
    const value = metadataValue(label);
    if (!value) return [] as string[];
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  };
  const fromArray = (value?: string[] | null) => (Array.isArray(value) ? value.filter(Boolean) : []);
  const dbSkillMatrix = typeof campaign.skill_matrix === "string" ? campaign.skill_matrix : null;
  const coreDescription = campaign.description
    .replace(/\s*Type:\s*[^.]+\./gi, "")
    .replace(/\s*Industry:\s*[^.]+\./gi, "")
    .replace(/\s*Employee levels:\s*[^.]+\./gi, "")
    .replace(/\s*Languages:\s*[^.]+\./gi, "")
    .replace(/\s*Skill proficiency:\s*[^.]+\./gi, "")
    .replace(/\s*Focus skills:\s*[^.]+\./gi, "")
    .replace(/\s*Skill matrix:\s*[^.]+\./gi, "")
    .trim();

  const skillTargetsFromMatrix = (() => {
    const raw = dbSkillMatrix ?? metadataValue("Skill matrix");
    if (!raw) return [] as Array<{ skill_name: string; proficiency: "General" | "Beginner" | "Beginner + Intermediate" | "Intermediate" | "Advanced" }>;
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
          proficiency: proficiency as "General" | "Beginner" | "Beginner + Intermediate" | "Intermediate" | "Advanced"
        };
      })
      .filter((entry): entry is { skill_name: string; proficiency: "General" | "Beginner" | "Beginner + Intermediate" | "Intermediate" | "Advanced" } => Boolean(entry));
  })();
  const fallbackFocusSkills = parseList("Focus skills");
  const dbCampaignType =
    campaign.campaign_type === "Exhaustive" || campaign.campaign_type === "Tailored"
      ? campaign.campaign_type
      : null;
  const dbIndustryType = typeof campaign.industry_type === "string" ? campaign.industry_type : null;
  const dbTargetLevels = fromArray(campaign.target_levels);
  const dbTargetLanguages = fromArray(campaign.target_languages as string[] | null | undefined);
  const dbSkillProficiency = fromArray(campaign.skill_proficiency_levels as string[] | null | undefined);
  const dbFocusSkills = fromArray(campaign.focus_skills);

  return {
    name: campaign.name,
    description: coreDescription || campaign.description,
    target_role: campaign.target_role,
    target_market: campaign.target_market,
    campaign_type:
      dbCampaignType ??
      ((metadataValue("Type")?.toLowerCase() === "exhaustive" ? "Exhaustive" : "Tailored") as "Exhaustive" | "Tailored"),
    industry_type: dbIndustryType ?? metadataValue("Industry") ?? "Jewellery",
    target_levels: dbTargetLevels.length > 0 ? dbTargetLevels : parseList("Employee levels"),
    target_languages: (dbTargetLanguages.length > 0 ? dbTargetLanguages : parseList("Languages")) as Array<
      "English" | "German" | "Spanish" | "French" | "Portuguese" | "Japanese" | "Mandarin" | "Dutch" | "Polish" | "Italian" | "Turkish"
    >,
    skill_targets:
      skillTargetsFromMatrix.length > 0
        ? skillTargetsFromMatrix
        : (dbFocusSkills.length > 0 ? dbFocusSkills : fallbackFocusSkills).map((skill_name) => ({
            skill_name,
            proficiency: (dbSkillProficiency[0] as "General" | "Beginner" | "Beginner + Intermediate" | "Intermediate" | "Advanced" | undefined) ?? "Intermediate"
          })),
    status: campaign.status,
    start_date: campaign.start_date,
    end_date: campaign.end_date
  };
}

export async function getRecommendationRows() {
  const live = await fetchLiveData();
  if (!live) {
    return buildRecommendationRows(mockUsers, mockCourses, mockSkills, mockRecommendations);
  }

  return buildRecommendationRows(live.users, live.courses, live.skills, live.recommendations);
}

export async function getEmployeeDashboardData(userId?: string) {
  const live = await fetchLiveData();
  const source = live ?? {
    users: mockUsers,
    campaigns: mockCampaigns,
    skills: mockSkills,
    courses: mockCourses,
    recommendations: mockRecommendations
  };
  const user = userId ? source.users.find((entry) => entry.id === userId) : source.users.find((entry) => entry.role === "employee");
  const journey = buildEmployeeJourney(user, source.campaigns, source.courses, source.skills, source.recommendations);

  if (!user || !journey) {
    return {
      profile: {
        market: "Singapore",
        role: "Boutique Manager",
        proficiencyLevel: "Intermediate"
      },
      journey: {
        title: "Employee",
        subtitle: "Learning profile",
        progress: 0,
        nextMilestone: "No recommendations yet",
        activePath: "Retail Leadership Excellence 2026",
        skillMix: mockSkills.slice(0, 4).map((skill) => ({ name: skill.skill_name, value: 25 }))
      },
      recommendations: buildRecommendationRows(source.users, source.courses, source.skills, source.recommendations),
      connectionStatus: hasSupabaseConnection ? "Connected to Supabase" : "Using local fallback"
    };
  }

  return {
    profile: {
      market: user.market,
      role: user.job_title,
      proficiencyLevel: user.proficiency_level ?? "Intermediate"
    },
    journey,
    recommendations: buildRecommendationRows(source.users, source.courses, source.skills, source.recommendations).filter(
      (row) => row.user.id === user.id
    ),
    connectionStatus: hasSupabaseConnection ? "Connected to Supabase" : "Using local fallback"
  };
}

export async function getCampaignWizardSkills() {
  const live = await fetchLiveData();
  if (!live) return mockSkills;
  return live.skills.length > 0 ? live.skills : mockSkills;
}
