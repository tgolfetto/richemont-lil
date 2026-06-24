insert into public.users (
  id,
  email,
  password,
  full_name,
  role,
  department,
  job_title,
  market,
  proficiency_level,
  created_at
) values
(
  '11111111-1111-4111-8111-111111111111',
  'manager@richemont.com',
  'admin123',
  'Sophia Lim',
  'learning_manager',
  'HR Learning & Development',
  'Regional Learning Manager',
  'APAC',
  null,
  '2026-01-08T08:00:00Z'
),
(
  '22222222-2222-4222-8222-222222222222',
  'employee@richemont.com',
  'employee123',
  'Daniel Tan',
  'employee',
  'Retail',
  'Boutique Manager',
  'Singapore',
  'Intermediate',
  '2026-01-12T08:00:00Z'
);

insert into public.skills (id, skill_name, description) values
('31111111-1111-4111-8111-111111111111', 'Accountability & Ownership', 'Clarifies accountability, follow-through, and decision ownership.'),
('31111111-1111-4111-8111-222222222222', 'Goal Setting', 'Builds clear objectives, KPIs, and business-aligned priorities.'),
('31111111-1111-4111-8111-333333333333', 'Coaching', 'Guides managers to coach with confidence and consistency.'),
('31111111-1111-4111-8111-444444444444', 'Leadership', 'Develops presence, influence, and team direction.'),
('31111111-1111-4111-8111-555555555555', 'Clienteling', 'Strengthens client relationships and repeat engagement.');

insert into public.campaigns (
  id,
  name,
  description,
  target_role,
  target_market,
  status,
  start_date,
  end_date,
  created_by,
  created_at
) values
(
  '51111111-1111-4111-8111-111111111111',
  'Retail Leadership Excellence 2026',
  'A regional learning journey designed to strengthen coaching, accountability, and leadership presence across APAC boutiques.',
  'Boutique Manager',
  'APAC',
  'Published',
  '2026-02-01',
  '2026-12-31',
  '11111111-1111-4111-8111-111111111111',
  '2026-01-10T08:00:00Z'
);

insert into public.courses (id, title, level, short_description, linkedin_url, skill_id) values
('41111111-1111-4111-8111-111111111111', 'Holding Your Team Accountable', 'Intermediate', 'Practical approaches to set expectations, follow through on commitments, and build a culture of ownership.', 'https://www.linkedin.com/learning/holding-your-team-accountable', '31111111-1111-4111-8111-111111111111'),
('41111111-1111-4111-8111-222222222222', 'Goal Setting: Objectives and Key Results', 'Beginner', 'Turn strategy into measurable outcomes with a structured OKR framework for retail teams.', 'https://www.linkedin.com/learning/goal-setting-objectives-and-key-results', '31111111-1111-4111-8111-222222222222'),
('41111111-1111-4111-8111-333333333333', 'Coaching Skills for Leaders', 'Intermediate', 'Coach boutique teams with clear feedback loops, curiosity-led conversations, and accountability.', 'https://www.linkedin.com/learning/coaching-skills-for-leaders', '31111111-1111-4111-8111-333333333333'),
('41111111-1111-4111-8111-444444444444', 'Developing Leadership Presence', 'Advanced', 'Build gravitas, composure, and influence when leading across markets and functions.', 'https://www.linkedin.com/learning/developing-leadership-presence', '31111111-1111-4111-8111-444444444444'),
('41111111-1111-4111-8111-555555555555', 'Building Customer Relationships', 'Intermediate', 'Convert service moments into loyal client relationships through thoughtful clienteling habits.', 'https://www.linkedin.com/learning/building-customer-relationships', '31111111-1111-4111-8111-555555555555');

insert into public.recommendations (id, user_id, course_id, status, created_at) values
('61111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', '41111111-1111-4111-8111-111111111111', 'Assigned', '2026-01-08T10:00:00Z'),
('61111111-1111-4111-8111-222222222222', '22222222-2222-4222-8222-222222222222', '41111111-1111-4111-8111-222222222222', 'In Progress', '2026-02-13T10:00:00Z'),
('61111111-1111-4111-8111-333333333333', '22222222-2222-4222-8222-222222222222', '41111111-1111-4111-8111-333333333333', 'Completed', '2026-03-16T10:00:00Z'),
('61111111-1111-4111-8111-444444444444', '22222222-2222-4222-8222-222222222222', '41111111-1111-4111-8111-555555555555', 'Assigned', '2026-04-20T10:00:00Z');
