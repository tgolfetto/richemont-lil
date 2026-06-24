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
  skill_proficiency_levels,
  spoken_languages,
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
  array['General','Intermediate']::public.skill_proficiency_enum[],
  array['English','French']::public.employee_language_enum[],
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
  array['Beginner + Intermediate','Intermediate']::public.skill_proficiency_enum[],
  array['English','Mandarin']::public.employee_language_enum[],
  '2026-01-12T08:00:00Z'
)
on conflict (id) do update set
  email = excluded.email,
  password = excluded.password,
  full_name = excluded.full_name,
  role = excluded.role,
  department = excluded.department,
  job_title = excluded.job_title,
  market = excluded.market,
  proficiency_level = excluded.proficiency_level,
  skill_proficiency_levels = excluded.skill_proficiency_levels,
  spoken_languages = excluded.spoken_languages;

insert into public.skills (id, skill_name, description) values
('31111111-1111-4111-8111-111111111111', 'Accountability & Ownership', 'Clarifies accountability, follow-through, and decision ownership.'),
('31111111-1111-4111-8111-222222222222', 'Goal Setting', 'Builds clear objectives, KPIs, and business-aligned priorities.'),
('31111111-1111-4111-8111-333333333333', 'Coaching', 'Guides managers to coach with confidence and consistency.'),
('31111111-1111-4111-8111-444444444444', 'Leadership', 'Develops presence, influence, and team direction.'),
('31111111-1111-4111-8111-555555555555', 'Clienteling', 'Strengthens client relationships and repeat engagement.')
on conflict (id) do update set
  skill_name = excluded.skill_name,
  description = excluded.description;

insert into public.campaigns (
  id,
  name,
  description,
  target_role,
  target_market,
  campaign_type,
  industry_type,
  target_levels,
  target_languages,
  skill_proficiency_levels,
  focus_skills,
  skill_matrix,
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
  'Exhaustive',
  'Jewellery',
  array['Manager','Senior Manager']::public.employee_level_enum[],
  array['English','Mandarin']::public.employee_language_enum[],
  array['Intermediate','Advanced']::public.skill_proficiency_enum[],
  array['Coaching','Leadership','Accountability & Ownership']::text[],
  'Coaching|Intermediate; Leadership|Advanced; Accountability & Ownership|Intermediate',
  'Published',
  '2026-02-01',
  '2026-12-31',
  '11111111-1111-4111-8111-111111111111',
  '2026-01-10T08:00:00Z'
),
(
  '51111111-1111-4111-8111-222222222222',
  'Clienteling Excellence',
  'Focused enablement for advisors and managers to elevate client relationships and repeat visit quality.',
  'Client Advisor',
  'Singapore',
  'Tailored',
  'Watches',
  array['Individual Contributor','Manager']::public.employee_level_enum[],
  array['English']::public.employee_language_enum[],
  array['Beginner + Intermediate']::public.skill_proficiency_enum[],
  array['Clienteling','Goal Setting']::text[],
  'Clienteling|Beginner + Intermediate; Goal Setting|Beginner + Intermediate',
  'Published',
  '2026-03-01',
  '2026-09-30',
  '11111111-1111-4111-8111-111111111111',
  '2026-02-14T08:00:00Z'
)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  target_role = excluded.target_role,
  target_market = excluded.target_market,
  campaign_type = excluded.campaign_type,
  industry_type = excluded.industry_type,
  target_levels = excluded.target_levels,
  target_languages = excluded.target_languages,
  skill_proficiency_levels = excluded.skill_proficiency_levels,
  focus_skills = excluded.focus_skills,
  skill_matrix = excluded.skill_matrix,
  status = excluded.status,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  created_by = excluded.created_by;

insert into public.courses (id, title, level, short_description, linkedin_url, skill_id) values
('41111111-1111-4111-8111-111111111111', 'Holding Your Team Accountable', 'Intermediate', 'Practical approaches to set expectations, follow through on commitments, and build a culture of ownership.', 'https://www.linkedin.com/learning/holding-your-team-accountable', '31111111-1111-4111-8111-111111111111'),
('41111111-1111-4111-8111-222222222222', 'Goal Setting: Objectives and Key Results', 'Beginner', 'Turn strategy into measurable outcomes with a structured OKR framework for retail teams.', 'https://www.linkedin.com/learning/goal-setting-objectives-and-key-results', '31111111-1111-4111-8111-222222222222'),
('41111111-1111-4111-8111-333333333333', 'Coaching Skills for Leaders', 'Intermediate', 'Coach boutique teams with clear feedback loops, curiosity-led conversations, and accountability.', 'https://www.linkedin.com/learning/coaching-skills-for-leaders', '31111111-1111-4111-8111-333333333333'),
('41111111-1111-4111-8111-444444444444', 'Developing Leadership Presence', 'Advanced', 'Build gravitas, composure, and influence when leading across markets and functions.', 'https://www.linkedin.com/learning/developing-leadership-presence', '31111111-1111-4111-8111-444444444444'),
('41111111-1111-4111-8111-555555555555', 'Building Customer Relationships', 'Intermediate', 'Convert service moments into loyal client relationships through thoughtful clienteling habits.', 'https://www.linkedin.com/learning/building-customer-relationships', '31111111-1111-4111-8111-555555555555')
on conflict (id) do update set
  title = excluded.title,
  level = excluded.level,
  short_description = excluded.short_description,
  linkedin_url = excluded.linkedin_url,
  skill_id = excluded.skill_id;

with cfg as (
  select
    array[
      'Foundations',
      'Practical Toolkit',
      'Applied Scenarios',
      'Manager Playbook',
      'Advanced Practice',
      'Cross-functional Collaboration',
      'Performance Coaching',
      'Execution Masterclass',
      'Capstone Project',
      'Scenario Labs',
      'Strategic Alignment',
      'Coaching Clinics',
      'Operational Excellence',
      'Transformation Studio'
    ]::text[] as titles,
    array[
      'Beginner',
      'Beginner',
      'Intermediate',
      'Intermediate',
      'Advanced',
      'Intermediate',
      'Advanced',
      'Advanced',
      'Intermediate',
      'Beginner',
      'Intermediate',
      'Intermediate',
      'Advanced',
      'Advanced'
    ]::text[] as levels
),
generated as (
  select
    s.id as skill_id,
    s.skill_name,
    gs as seq,
    cfg.titles[((gs - 1) % array_length(cfg.titles, 1)) + 1] as title_suffix,
    cfg.levels[((gs - 1) % array_length(cfg.levels, 1)) + 1] as course_level
  from public.skills s
  cross join cfg
  cross join generate_series(1, 24) gs
),
rows_to_insert as (
  select
    (
      substr(md5(skill_id::text || '-' || seq::text || '-mock-course'), 1, 8) || '-' ||
      substr(md5(skill_id::text || '-' || seq::text || '-mock-course'), 9, 4) || '-' ||
      '4' || substr(md5(skill_id::text || '-' || seq::text || '-mock-course'), 14, 3) || '-' ||
      '8' || substr(md5(skill_id::text || '-' || seq::text || '-mock-course'), 18, 3) || '-' ||
      substr(md5(skill_id::text || '-' || seq::text || '-mock-course'), 21, 12)
    )::uuid as id,
    format('%s: %s %s', skill_name, title_suffix, seq) as title,
    course_level as level,
    format('Extended catalog course for %s focused on %s.', skill_name, lower(title_suffix)) as short_description,
    'https://www.linkedin.com/learning/search?keywords=' ||
      replace(replace(skill_name, '&', '%26'), ' ', '%20') as linkedin_url,
    skill_id
  from generated
)
insert into public.courses (id, title, level, short_description, linkedin_url, skill_id)
select id, title, level, short_description, linkedin_url, skill_id
from rows_to_insert
on conflict (id) do nothing;

insert into public.recommendations (id, user_id, course_id, status, created_at) values
('61111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', '41111111-1111-4111-8111-111111111111', 'Assigned', '2026-01-08T10:00:00Z'),
('61111111-1111-4111-8111-222222222222', '22222222-2222-4222-8222-222222222222', '41111111-1111-4111-8111-222222222222', 'In Progress', '2026-02-13T10:00:00Z'),
('61111111-1111-4111-8111-333333333333', '22222222-2222-4222-8222-222222222222', '41111111-1111-4111-8111-333333333333', 'Completed', '2026-03-16T10:00:00Z'),
('61111111-1111-4111-8111-444444444444', '22222222-2222-4222-8222-222222222222', '41111111-1111-4111-8111-555555555555', 'Assigned', '2026-04-20T10:00:00Z')
on conflict (id) do update set
  user_id = excluded.user_id,
  course_id = excluded.course_id,
  status = excluded.status,
  created_at = excluded.created_at;
