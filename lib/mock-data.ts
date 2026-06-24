import type { Campaign, Course, Recommendation, Skill, User } from "@/lib/types";

export const mockUsers: User[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    email: "manager@richemont.com",
    password: "admin123",
    full_name: "Sophia Lim",
    role: "learning_manager",
    department: "HR Learning & Development",
    job_title: "Regional Learning Manager",
    market: "APAC",
    created_at: "2026-01-08T08:00:00.000Z"
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    email: "employee@richemont.com",
    password: "employee123",
    full_name: "Daniel Tan",
    role: "employee",
    department: "Retail",
    job_title: "Boutique Manager",
    market: "Singapore",
    proficiency_level: "Intermediate",
    created_at: "2026-01-12T08:00:00.000Z"
  }
];

export const mockSkills: Skill[] = [
  {
    id: "31111111-1111-4111-8111-111111111111",
    skill_name: "Accountability & Ownership",
    description: "Clarifies accountability, follow-through, and decision ownership."
  },
  {
    id: "31111111-1111-4111-8111-222222222222",
    skill_name: "Goal Setting",
    description: "Builds clear objectives, KPIs, and business-aligned priorities."
  },
  {
    id: "31111111-1111-4111-8111-333333333333",
    skill_name: "Coaching",
    description: "Guides managers to coach with confidence and consistency."
  },
  {
    id: "31111111-1111-4111-8111-444444444444",
    skill_name: "Leadership",
    description: "Develops presence, influence, and team direction."
  },
  {
    id: "31111111-1111-4111-8111-555555555555",
    skill_name: "Clienteling",
    description: "Strengthens client relationships and repeat engagement."
  }
];

const baseMockCourses: Course[] = [
  {
    id: "41111111-1111-4111-8111-111111111111",
    title: "Holding Your Team Accountable",
    level: "Intermediate",
    short_description:
      "Practical approaches to set expectations, follow through on commitments, and build a culture of ownership.",
    linkedin_url: "https://www.linkedin.com/learning/holding-your-team-accountable",
    skill_id: mockSkills[0].id
  },
  {
    id: "41111111-1111-4111-8111-222222222222",
    title: "Goal Setting: Objectives and Key Results",
    level: "Beginner",
    short_description:
      "Turn strategy into measurable outcomes with a structured OKR framework for retail teams.",
    linkedin_url: "https://www.linkedin.com/learning/goal-setting-objectives-and-key-results",
    skill_id: mockSkills[1].id
  },
  {
    id: "41111111-1111-4111-8111-333333333333",
    title: "Coaching Skills for Leaders",
    level: "Intermediate",
    short_description:
      "Coach boutique teams with clear feedback loops, curiosity-led conversations, and accountability.",
    linkedin_url: "https://www.linkedin.com/learning/coaching-skills-for-leaders",
    skill_id: mockSkills[2].id
  },
  {
    id: "41111111-1111-4111-8111-444444444444",
    title: "Developing Leadership Presence",
    level: "Advanced",
    short_description:
      "Build gravitas, composure, and influence when leading across markets and functions.",
    linkedin_url: "https://www.linkedin.com/learning/developing-leadership-presence",
    skill_id: mockSkills[3].id
  },
  {
    id: "41111111-1111-4111-8111-555555555555",
    title: "Building Customer Relationships",
    level: "Intermediate",
    short_description:
      "Convert service moments into loyal client relationships through thoughtful clienteling habits.",
    linkedin_url: "https://www.linkedin.com/learning/building-customer-relationships",
    skill_id: mockSkills[4].id
  }
];

const generatedCourseTitles = [
  "Foundations",
  "Practical Toolkit",
  "Applied Scenarios",
  "Manager Playbook",
  "Advanced Practice",
  "Cross-functional Collaboration",
  "Performance Coaching",
  "Execution Masterclass",
  "Capstone Project"
];

const generatedCourseLevels = [
  "Beginner",
  "Beginner",
  "Intermediate",
  "Intermediate",
  "Advanced",
  "Intermediate",
  "Advanced",
  "Advanced",
  "Intermediate"
];

const generatedMockCourses: Course[] = mockSkills.flatMap((skill, skillIndex) =>
  Array.from({ length: 9 }, (_, offset) => {
    const titleSuffix = generatedCourseTitles[offset];
    const level = generatedCourseLevels[offset];
    return {
      id: `mock-course-${skillIndex + 1}-${offset + 1}`,
      title: `${skill.skill_name}: ${titleSuffix}`,
      level,
      short_description: `Extended catalog course for ${skill.skill_name} focused on ${titleSuffix.toLowerCase()}.`,
      linkedin_url: `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(skill.skill_name)}`,
      skill_id: skill.id
    };
  })
);

export const mockCourses: Course[] = [...baseMockCourses, ...generatedMockCourses];

export const mockCampaigns: Campaign[] = [
  {
    id: "51111111-1111-4111-8111-111111111111",
    name: "Retail Leadership Excellence 2026",
    description:
      "A regional learning journey designed to strengthen coaching, accountability, and leadership presence across APAC boutiques.",
    target_role: "Boutique Manager",
    target_market: "APAC",
    status: "Published",
    start_date: "2026-02-01",
    end_date: "2026-12-31",
    created_by: mockUsers[0].id,
    created_at: "2026-01-10T08:00:00.000Z"
  },
  {
    id: "51111111-1111-4111-8111-222222222222",
    name: "Clienteling Excellence",
    description:
      "Focused enablement for advisors and managers to elevate client relationships and repeat visit quality.",
    target_role: "Client Advisor",
    target_market: "Singapore",
    status: "Published",
    start_date: "2026-03-01",
    end_date: "2026-09-30",
    created_by: mockUsers[0].id,
    created_at: "2026-02-14T08:00:00.000Z"
  },
  {
    id: "51111111-1111-4111-8111-333333333333",
    name: "Digital Marketing Foundations",
    description:
      "A campaign covering omnichannel basics, content planning, and performance-led execution.",
    target_role: "Marketing Executive",
    target_market: "Malaysia",
    status: "Published",
    start_date: "2026-04-15",
    end_date: "2026-10-15",
    created_by: mockUsers[0].id,
    created_at: "2026-03-18T08:00:00.000Z"
  }
];

export const mockRecommendations: Recommendation[] = [
  {
    id: "61111111-1111-4111-8111-111111111111",
    user_id: mockUsers[1].id,
    course_id: mockCourses[0].id,
    status: "Assigned",
    created_at: "2026-01-08T10:00:00.000Z"
  },
  {
    id: "61111111-1111-4111-8111-222222222222",
    user_id: mockUsers[1].id,
    course_id: mockCourses[1].id,
    status: "In Progress",
    created_at: "2026-02-13T10:00:00.000Z"
  },
  {
    id: "61111111-1111-4111-8111-333333333333",
    user_id: mockUsers[1].id,
    course_id: mockCourses[2].id,
    status: "Completed",
    created_at: "2026-03-16T10:00:00.000Z"
  },
  {
    id: "61111111-1111-4111-8111-444444444444",
    user_id: mockUsers[1].id,
    course_id: mockCourses[4].id,
    status: "Assigned",
    created_at: "2026-04-20T10:00:00.000Z"
  }
];

export const monthlyActivity = [
  { month: "Jan", assigned: 118, completed: 74, active: 1210 },
  { month: "Feb", assigned: 134, completed: 92, active: 1340 },
  { month: "Mar", assigned: 164, completed: 116, active: 1510 },
  { month: "Apr", assigned: 190, completed: 139, active: 1730 },
  { month: "May", assigned: 210, completed: 162, active: 1945 },
  { month: "Jun", assigned: 236, completed: 181, active: 2140 }
];

export const completionByMarket = [
  { market: "Singapore", completion: 86 },
  { market: "Malaysia", completion: 77 },
  { market: "Thailand", completion: 71 },
  { market: "Australia", completion: 68 },
  { market: "Hong Kong", completion: 81 }
];

export const kpis = [
  { label: "Active Learners", value: "3245", delta: "+12.4%" },
  { label: "Activation Rate", value: "82%", delta: "+4.2%" },
  { label: "Course Completion Rate", value: "74%", delta: "+6.8%" },
  { label: "Retention Rate", value: "68%", delta: "+2.1%" }
];

export const managerHighlights = [
  {
    title: "Program health",
    value: "91%",
    detail: "Campaigns are on track with strong participation across APAC."
  },
  {
    title: "Priority skill",
    value: "Coaching",
    detail: "Most recommended capability for boutique managers this quarter."
  },
  {
    title: "Recommended courses",
    value: "18",
    detail: "Fresh LinkedIn Learning mappings generated for this campaign."
  }
];

export const campaignWizardOptions = {
  industries: [
    "Jewellery",
    "Watches",
    "Fashion & Accessories",
    "Online Distributors"
  ],
  campaignTypes: ["Exhaustive", "Tailored"],
  marketHierarchy: [
    {
      group: "APAC",
      markets: ["Singapore", "Malaysia", "Thailand", "Australia", "Hong Kong"]
    },
    {
      group: "Europe",
      markets: ["France", "Italy", "Switzerland", "United Kingdom"]
    },
    {
      group: "Americas",
      markets: ["United States", "Canada", "Mexico", "Brazil"]
    }
  ],
  roleHierarchy: [
    {
      group: "Corporate/Office Employees",
      categories: [
        { name: "Management", roles: ["Legal", "Compliance", "Safety", "Health", "Real Estate"] },
        { name: "Marketing & Communications", roles: ["Brand", "Digital Marketing", "PR", "VM"] },
        { name: "Sales & Commercial", roles: ["Wholesale", "Business Development", "E-commerce"] },
        { name: "Finance & Accounting", roles: ["Financial Analysis", "Accounting", "Brand Controls", "Treasury"] },
        { name: "HR", roles: ["HR"] },
        { name: "IT", roles: ["IT"] },
        { name: "Supply Chain, Logistics, Procurement, QC", roles: ["Supply Chain", "Logistics", "Procurement", "QC"] },
        { name: "CRC", roles: ["CRC"] }
      ]
    },
    {
      group: "Boutique/Retail Employees",
      categories: [
        { name: "Boutique Management", roles: ["Boutique Director", "Store Manager", "Assistant Manager"] },
        { name: "Client Advisors", roles: ["Client Advisor", "Sales Associate"] }
      ]
    }
  ],
  levels: ["General", "Individual Contributor", "Manager", "Senior Manager", "C-Suite"],
  languages: [
    "English",
    "German",
    "Spanish",
    "French",
    "Portuguese",
    "Japanese",
    "Mandarin",
    "Dutch",
    "Polish",
    "Italian",
    "Turkish"
  ],
  skillProficiencyLevels: [
    "General",
    "Beginner",
    "Beginner + Intermediate",
    "Intermediate",
    "Advanced"
  ],
  skills: [
    "Accountability & Ownership",
    "Goal Setting",
    "Leadership",
    "Coaching",
    "Clienteling"
  ]
};

export const employeeJourney = {
  title: "Daniel Tan",
  subtitle: "Boutique Manager · Singapore",
  progress: 63,
  nextMilestone: "Complete Coaching Skills for Leaders",
  activePath: "Retail Leadership Excellence 2026",
  skillMix: [
    { name: "Leadership", value: 78 },
    { name: "Coaching", value: 66 },
    { name: "Clienteling", value: 84 },
    { name: "Goal Setting", value: 58 }
  ]
};
