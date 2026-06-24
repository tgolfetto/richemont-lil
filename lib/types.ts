export type Role = "learning_manager" | "employee";
export type SkillProficiencyLevel =
  | "General"
  | "Beginner"
  | "Beginner + Intermediate"
  | "Intermediate"
  | "Advanced";
export type EmployeeLanguage =
  | "English"
  | "German"
  | "Spanish"
  | "French"
  | "Portuguese"
  | "Japanese"
  | "Mandarin"
  | "Dutch"
  | "Polish"
  | "Italian"
  | "Turkish";

export type User = {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: Role;
  department: string;
  job_title: string;
  market: string;
  proficiency_level?: string | null;
  skill_proficiency_levels?: SkillProficiencyLevel[] | null;
  spoken_languages?: EmployeeLanguage[] | null;
  created_at: string;
};

export type Campaign = {
  id: string;
  name: string;
  description: string;
  target_role: string;
  target_market: string;
  campaign_type?: "Exhaustive" | "Tailored" | null;
  industry_type?: string | null;
  target_levels?: string[] | null;
  target_languages?: EmployeeLanguage[] | null;
  skill_proficiency_levels?: SkillProficiencyLevel[] | null;
  focus_skills?: string[] | null;
  skill_matrix?: string | null;
  status: "Draft" | "Published" | "Archived";
  start_date: string;
  end_date: string;
  created_by: string;
  created_at?: string;
};

export type CampaignFormValues = {
  name: string;
  description: string;
  target_role: string;
  target_market: string;
  campaign_type: "Exhaustive" | "Tailored";
  industry_type: string;
  target_levels: string[];
  target_languages: EmployeeLanguage[];
  skill_targets: Array<{
    skill_name: string;
    proficiency: SkillProficiencyLevel;
  }>;
  status: Campaign["status"];
  start_date: string;
  end_date: string;
};

export type Skill = {
  id: string;
  skill_name: string;
  description: string;
};

export type Course = {
  id: string;
  title: string;
  level: string;
  short_description: string;
  linkedin_url: string;
  skill_id: string;
  created_at?: string;
};

export type Recommendation = {
  id: string;
  user_id: string;
  course_id: string;
  status: "Assigned" | "In Progress" | "Completed";
  created_at?: string;
};

export type SessionUser = Pick<
  User,
  "id" | "email" | "full_name" | "role" | "department" | "job_title" | "market" | "proficiency_level"
>;
