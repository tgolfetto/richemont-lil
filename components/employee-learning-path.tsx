"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getCourseMockImage } from "@/lib/course-visuals";

type RecommendationItem = {
  id: string;
  status: "Assigned" | "In Progress" | "Completed";
  course: {
    id: string;
    title: string;
    level: string;
    short_description: string;
    linkedin_url: string;
    skill: {
      skill_name: string;
    };
  };
};

type SkillMixItem = {
  name: string;
  value: number;
};

type EmployeeLearningPathProps = {
  recommendations: RecommendationItem[];
  skillMix: SkillMixItem[];
};

function toSkillLevel(value: number) {
  if (value >= 75) return "Advanced";
  if (value >= 45) return "Intermediate";
  return "Beginner";
}

export function EmployeeLearningPath({ recommendations, skillMix }: EmployeeLearningPathProps) {
  const availableSkills = useMemo(() => {
    const fromRecommendations = Array.from(
      new Set(recommendations.map((item) => item.course.skill.skill_name))
    );
    if (fromRecommendations.length > 0) return fromRecommendations;
    return skillMix.map((item) => item.name);
  }, [recommendations, skillMix]);

  const [selectedSkills, setSelectedSkills] = useState<string[]>(availableSkills.slice(0, 2));

  function toggleSkill(skill: string) {
    setSelectedSkills((current) =>
      current.includes(skill) ? current.filter((entry) => entry !== skill) : [...current, skill]
    );
  }

  const filteredRecommendations = useMemo(() => {
    if (selectedSkills.length === 0) return recommendations;
    return recommendations.filter((item) => selectedSkills.includes(item.course.skill.skill_name));
  }, [recommendations, selectedSkills]);

  const selectedSkillRows =
    selectedSkills.length > 0
      ? selectedSkills
      : availableSkills.slice(0, 3);

  return (
    <div id="learning-path" className="space-y-2">
      <h2 className="font-display text-xl font-light text-[color:var(--color-text)]">Learning Path</h2>
      <div className="grid gap-2.5 lg:grid-cols-3">
        <div className="rounded-none border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Choose skills to improve</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {availableSkills.map((skill) => {
              const active = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-none border px-2 py-1 text-xs transition-colors ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-zinc-300 bg-surface text-[color:var(--color-text)]"
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-none border border-zinc-200 bg-white p-4 lg:col-span-2">
          <p className="text-xs text-zinc-500">Skill levels and milestones</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500">
                  <th className="px-2 py-2 text-left font-medium">Skill</th>
                  <th className="px-2 py-2 text-left font-medium">Current level</th>
                  <th className="px-2 py-2 text-left font-medium">Progress</th>
                  <th className="px-2 py-2 text-left font-medium">Next milestone</th>
                </tr>
              </thead>
              <tbody>
                {selectedSkillRows.map((skillName) => {
                  const metric = skillMix.find((item) => item.name === skillName);
                  const progress = metric?.value ?? 35;
                  const milestone = Math.min(100, progress + 15);
                  return (
                    <tr key={skillName} className="border-b border-zinc-100">
                      <td className="px-2 py-2 text-[color:var(--color-text)]">{skillName}</td>
                      <td className="px-2 py-2 text-zinc-600">{toSkillLevel(progress)}</td>
                      <td className="px-2 py-2 text-zinc-600">{progress}%</td>
                      <td className="px-2 py-2 text-zinc-600">{milestone}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-none border border-zinc-200 bg-footer p-4 lg:col-span-3">
          <p className="text-xs text-zinc-500">Recommended courses based on selected skills</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {filteredRecommendations.slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-none border border-zinc-200 bg-white p-3">
                <img
                  src={getCourseMockImage(item.course.id)}
                  alt={item.course.title}
                  className="h-20 w-full rounded-none border border-zinc-200 object-cover"
                />
                <p className="text-sm font-medium text-[color:var(--color-text)]">{item.course.title}</p>
                <p className="mt-1 text-xs text-zinc-600">{item.course.skill.skill_name}</p>
                <div className="mt-2">
                  <Link
                    href={item.course.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 items-center rounded-none border border-primary bg-transparent px-3 text-[11px] font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    Watch
                  </Link>
                </div>
              </div>
            ))}
            {filteredRecommendations.length === 0 ? (
              <p className="text-xs text-zinc-600">No recommendations available for the selected skills.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
