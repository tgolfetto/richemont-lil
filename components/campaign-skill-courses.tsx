"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CourseRow = {
  id: string;
  title: string;
  linkedin_url: string;
  sequence: number;
  assigned: number;
  inProgress: number;
  completed: number;
  assignedUsers: CourseUser[];
  inProgressUsers: CourseUser[];
  completedUsers: CourseUser[];
};

type CourseUser = {
  id: string;
  full_name: string;
  job_title: string;
  market: string;
};

type LanguageGroup = {
  language: string;
  courses: CourseRow[];
};

type CampaignSkillCoursesProps = {
  campaignId: string;
  campaignName: string;
  skillName: string;
  proficiency: string;
  byLanguage: LanguageGroup[];
};

const PAGE_SIZE = 5;

export function CampaignSkillCourses({
  campaignId,
  campaignName,
  skillName,
  proficiency,
  byLanguage
}: CampaignSkillCoursesProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(byLanguage[0]?.language ?? "English");
  const [pages, setPages] = useState<Record<string, number>>({});
  const [activePopup, setActivePopup] = useState<{
    course: CourseRow;
    language: string;
    status: "assigned" | "inProgress" | "completed";
  } | null>(null);

  const languageOptions = useMemo(
    () => byLanguage.map((entry) => entry.language),
    [byLanguage]
  );

  useEffect(() => {
    if (languageOptions.length === 0) return;
    if (!languageOptions.includes(selectedLanguage)) {
      setSelectedLanguage(languageOptions[0]);
    }
  }, [languageOptions, selectedLanguage]);

  function currentPage(language: string) {
    return pages[language] ?? 1;
  }

  function setLanguagePage(language: string, page: number) {
    setPages((current) => ({ ...current, [language]: page }));
  }

  function openCourseStatus(
    course: CourseRow,
    language: string,
    status: "assigned" | "inProgress" | "completed"
  ) {
    setActivePopup({ course, language, status });
  }

  const popupUsers =
    activePopup?.status === "assigned"
      ? activePopup.course.assignedUsers
      : activePopup?.status === "inProgress"
        ? activePopup.course.inProgressUsers
        : activePopup?.status === "completed"
          ? activePopup.course.completedUsers
          : [];

  const popupStatusLabel =
    activePopup?.status === "assigned"
      ? "Assigned"
      : activePopup?.status === "inProgress"
        ? "In Progress"
        : "Completed";

  const popupExportHref = activePopup
    ? `/api/campaigns/${campaignId}/export?type=users&courseId=${encodeURIComponent(activePopup.course.id)}&status=${encodeURIComponent(popupStatusLabel)}`
    : "#";

  function closePopup() {
    setActivePopup(null);
  }

  return (
    <div className="rounded-none border border-zinc-200 bg-surface">
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 p-4 pb-2">
        <p className="font-display text-lg text-[color:var(--color-text)]">{skillName}</p>
        <span className="rounded-none border border-zinc-300 bg-white px-2 py-0.5 text-xs text-[color:var(--color-text)]">
          {proficiency}
        </span>
      </div>
      <div className="space-y-3 p-4 pt-2">
        {byLanguage.length > 0 ? (
          (() => {
            const languageGroup =
              byLanguage.find((entry) => entry.language === selectedLanguage) ?? byLanguage[0];
            const totalPages = Math.max(1, Math.ceil(languageGroup.courses.length / PAGE_SIZE));
            const page = Math.min(currentPage(languageGroup.language), totalPages);
            const start = (page - 1) * PAGE_SIZE;
            const pageCourses = languageGroup.courses.slice(start, start + PAGE_SIZE);

            return (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>Language</span>
                    <select
                      value={languageGroup.language}
                      onChange={(event) => setSelectedLanguage(event.target.value)}
                      className="h-7 rounded-none border border-primary bg-transparent px-2 text-[11px] text-primary outline-none"
                    >
                      {byLanguage.map((entry) => (
                        <option key={entry.language} value={entry.language}>
                          {entry.language}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLanguagePage(languageGroup.language, Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="inline-flex h-7 items-center rounded-none border border-primary bg-transparent px-2 text-[11px] text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <p className="text-[11px] text-zinc-500">
                      {page}/{totalPages}
                    </p>
                    <button
                      type="button"
                      onClick={() => setLanguagePage(languageGroup.language, Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="inline-flex h-7 items-center rounded-none border border-primary bg-transparent px-2 text-[11px] text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
                {pageCourses.length > 0 ? (
                  <div className="space-y-2">
                    {pageCourses.map((course) => (
                      <div
                        key={`${course.id}-${languageGroup.language}-${course.sequence}`}
                        className="grid items-center gap-2 rounded-none border border-zinc-200 bg-white px-3 py-2 text-xs md:grid-cols-[1fr_2.4fr_1.7fr_auto]"
                      >
                        <p className="text-zinc-500">{course.id.slice(0, 8)}-{course.sequence}</p>
                        <p className="text-[color:var(--color-text)]">
                          {course.title}
                          {languageGroup.language !== "English" ? ` (${languageGroup.language})` : ""}
                        </p>
                        <div className="flex flex-wrap gap-1 text-[10px]">
                          <button
                            type="button"
                            onClick={() => openCourseStatus(course, languageGroup.language, "assigned")}
                            className="rounded-none border border-zinc-300 bg-surface px-1.5 py-0.5 text-zinc-600"
                          >
                            Assigned {course.assigned}
                          </button>
                          <button
                            type="button"
                            onClick={() => openCourseStatus(course, languageGroup.language, "inProgress")}
                            className="rounded-none border border-zinc-300 bg-surface px-1.5 py-0.5 text-zinc-600"
                          >
                            In Progress {course.inProgress}
                          </button>
                          <button
                            type="button"
                            onClick={() => openCourseStatus(course, languageGroup.language, "completed")}
                            className="rounded-none border border-zinc-300 bg-surface px-1.5 py-0.5 text-zinc-600"
                          >
                            Completed {course.completed}
                          </button>
                        </div>
                        <Link
                          href={`${course.linkedin_url}${course.linkedin_url.includes("?") ? "&" : "?"}language=${encodeURIComponent(languageGroup.language)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-7 items-center rounded-none border border-primary bg-transparent px-3 text-[11px] font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                        >
                          Watch
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">No mapped courses available for this skill.</p>
                )}
              </div>
            );
          })()
        ) : (
          <p className="text-xs text-zinc-500">No mapped courses available for this skill.</p>
        )}
      </div>
      {activePopup ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={closePopup}
        >
          <div
            className="w-full max-w-4xl rounded-none border border-zinc-300 bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-4 py-3">
              <div className="space-y-1">
                <p className="font-display text-lg font-light text-[color:var(--color-text)]">{campaignName}</p>
                <p className="text-xs text-zinc-500">
                  {activePopup.course.title} · {skillName} · {proficiency} · {activePopup.language}
                </p>
                <p className="text-xs text-zinc-500">
                  Status: <span className="text-[color:var(--color-text)]">{popupStatusLabel}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={closePopup}
                className="inline-flex h-8 items-center rounded-none border border-primary bg-transparent px-3 text-[11px] font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="max-h-[45vh] overflow-y-auto px-4 py-3">
              {popupUsers.length > 0 ? (
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500">
                      <th className="px-2 py-2 text-left font-medium">Employee</th>
                      <th className="px-2 py-2 text-left font-medium">Job title</th>
                      <th className="px-2 py-2 text-left font-medium">Market</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popupUsers.map((user) => (
                      <tr key={`${activePopup.course.id}-${popupStatusLabel}-${user.id}`} className="border-b border-zinc-100">
                        <td className="px-2 py-2 text-[color:var(--color-text)]">{user.full_name}</td>
                        <td className="px-2 py-2 text-zinc-600">{user.job_title}</td>
                        <td className="px-2 py-2 text-zinc-600">{user.market}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xs text-zinc-500">No employees in this status.</p>
              )}
            </div>

            <div className="flex justify-end border-t border-zinc-200 px-4 py-3">
              <Link
                href={popupExportHref}
                className="inline-flex h-8 items-center rounded-none border border-primary bg-transparent px-3 text-[11px] font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Export this list
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
