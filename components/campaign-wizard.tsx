"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { campaignWizardOptions } from "@/lib/mock-data";
import { useMemo, useState } from "react";

const stepTitles = ["Campaign details", "Target audience", "Learning objectives"];

type WizardState = {
  campaignName: string;
  description: string;
  startDate: string;
  endDate: string;
  campaignType: string;
  industryType: string;
  markets: string[];
  roles: string[];
  levels: string[];
  languages: string[];
  skillProficiencyLevels: string[];
  skills: string[];
};

const initialState: WizardState = {
  campaignName: "Retail Leadership Excellence 2026",
  description:
    "A luxury retail capability journey focused on leadership presence, accountability, and coaching.",
  startDate: "2026-02-01",
  endDate: "2026-12-31",
  campaignType: "Tailored",
  industryType: "Jewellery",
  markets: ["APAC", "Singapore", "Malaysia"],
  roles: ["Boutique Management · Store Manager", "Client Advisors · Client Advisor"],
  levels: ["Manager", "Senior Manager"],
  languages: ["English"],
  skillProficiencyLevels: ["Intermediate", "Advanced"],
  skills: ["Accountability & Ownership", "Goal Setting", "Leadership"]
};

type CampaignWizardProps = {
  skillOptions: string[];
};

export function CampaignWizard({ skillOptions }: CampaignWizardProps) {
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSource, setSaveSource] = useState<"local" | "supabase" | null>(null);
  const [form, setForm] = useState<WizardState>(initialState);
  const activeStep = useMemo(() => stepTitles[step], [step]);

  function toggleMulti(
    selectKey: keyof Pick<WizardState, "markets" | "roles" | "levels" | "languages" | "skillProficiencyLevels" | "skills">,
    value: string
  ) {
    setForm((current) => {
      const list = current[selectKey];
      const exists = list.includes(value);
      return {
        ...current,
        [selectKey]: exists ? list.filter((item) => item !== value) : [...list, value]
      } as WizardState;
    });
  }

  async function nextStep() {
    if (step === 2) {
      setSaving(true);
      setSaved(false);
      try {
        const response = await fetch("/api/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });

        if (!response.ok) {
          throw new Error("Supabase save unavailable");
        }

        setSaveSource("supabase");
        setSaved(true);
        return;
      } catch {
        try {
          localStorage.setItem("rlr_campaign_draft", JSON.stringify(form));
          setSaveSource("local");
          setSaved(true);
        } catch {
          setSaveSource(null);
          setSaved(false);
        }
      } finally {
        setSaving(false);
      }
      return;
    }
    setStep((value) => Math.min(value + 1, 2));
  }

  return (
    <Card className="overflow-hidden rounded-none">
      <CardHeader className="border-b border-zinc-200 bg-surface">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="font-display text-3xl font-light">Create Campaign</CardTitle>
            <CardDescription className="max-w-2xl">
              Configure campaign type, industry, hierarchical markets, role clusters, and employee levels.
            </CardDescription>
          </div>
          <div className="hidden items-center rounded-none border border-zinc-200 bg-white px-4 py-2 text-sm text-[color:var(--color-text)] md:flex">
            {activeStep}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        <div className="grid gap-2.5 md:grid-cols-3">
          {stepTitles.map((title, index) => {
            const current = index === step;
            const complete = index < step;
            return (
              <div
                key={title}
                className={`rounded-none border px-4 py-3 ${
                  current
                    ? "border-primary bg-primary text-white"
                    : complete
                      ? "border-zinc-200 bg-footer"
                      : "border-zinc-200 bg-white"
                }`}
              >
                <p className={`text-xs ${current ? "text-white/80" : "text-zinc-500"}`}>Step {index + 1}</p>
                <p className="mt-1 text-sm font-medium">{title}</p>
              </div>
            );
          })}
        </div>

        {step === 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <Label htmlFor="campaignName">Campaign name</Label>
              <Input
                id="campaignName"
                value={form.campaignName}
                onChange={(event) => setForm({ ...form, campaignName: event.target.value })}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="startDate">Start date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(event) => setForm({ ...form, endDate: event.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="campaignType">Campaign type</Label>
              <select
                id="campaignType"
                value={form.campaignType}
                onChange={(event) => setForm({ ...form, campaignType: event.target.value })}
                className="h-11 w-full rounded-none border border-primary bg-white px-4 text-sm text-[color:var(--color-text)] outline-none"
              >
                {campaignWizardOptions.campaignTypes.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="industryType">Industry type</Label>
              <select
                id="industryType"
                value={form.industryType}
                onChange={(event) => setForm({ ...form, industryType: event.target.value })}
                className="h-11 w-full rounded-none border border-primary bg-white px-4 text-sm text-[color:var(--color-text)] outline-none"
              >
                {campaignWizardOptions.industries.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-none border border-zinc-200 p-4">
              <p className="text-sm font-medium text-[color:var(--color-text)]">Markets</p>
              <div className="mt-3 space-y-4">
                {campaignWizardOptions.marketHierarchy.map((group) => (
                  <div key={group.group}>
                    <button
                      type="button"
                      onClick={() => toggleMulti("markets", group.group)}
                      className={`mr-2 rounded-none border px-3 py-1 text-xs ${
                        form.markets.includes(group.group)
                          ? "border-primary bg-primary text-white"
                          : "border-zinc-300 bg-white text-[color:var(--color-text)]"
                      }`}
                    >
                      {group.group}
                    </button>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.markets.map((market) => (
                        <button
                          key={market}
                          type="button"
                          onClick={() => toggleMulti("markets", market)}
                          className={`rounded-none border px-3 py-1 text-xs ${
                            form.markets.includes(market)
                              ? "border-primary bg-primary text-white"
                              : "border-zinc-300 bg-white text-[color:var(--color-text)]"
                          }`}
                        >
                          {market}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-none border border-zinc-200 p-4">
              <p className="text-sm font-medium text-[color:var(--color-text)]">Roles (hierarchical)</p>
              <div className="mt-3 space-y-4">
                {campaignWizardOptions.roleHierarchy.map((roleGroup) => (
                  <div key={roleGroup.group}>
                    <p className="text-xs text-zinc-600">{roleGroup.group}</p>
                    <div className="mt-2 space-y-2">
                      {roleGroup.categories.map((category) => (
                        <div key={category.name}>
                          <p className="text-xs text-zinc-500">{category.name}</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {category.roles.map((role) => {
                              const value = `${category.name} · ${role}`;
                              const checked = form.roles.includes(value);
                              return (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => toggleMulti("roles", value)}
                                  className={`rounded-none border px-3 py-1 text-xs ${
                                    checked
                                      ? "border-primary bg-primary text-white"
                                      : "border-zinc-300 bg-white text-[color:var(--color-text)]"
                                  }`}
                                >
                                  {role}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-none border border-zinc-200 p-4">
              <p className="text-sm font-medium text-[color:var(--color-text)]">Employee levels</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {campaignWizardOptions.levels.map((value) => {
                  const checked = form.levels.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleMulti("levels", value)}
                      className={`rounded-none border px-3 py-1 text-xs ${
                        checked
                          ? "border-primary bg-primary text-white"
                          : "border-zinc-300 bg-white text-[color:var(--color-text)]"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-none border border-zinc-200 p-4">
              <p className="text-sm font-medium text-[color:var(--color-text)]">Languages</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {campaignWizardOptions.languages.map((value) => {
                  const checked = form.languages.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleMulti("languages", value)}
                      className={`rounded-none border px-3 py-1 text-xs ${
                        checked
                          ? "border-primary bg-primary text-white"
                          : "border-zinc-300 bg-white text-[color:var(--color-text)]"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-none border border-zinc-200 p-4">
              <p className="text-sm font-medium text-[color:var(--color-text)]">Skill proficiency targets</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {campaignWizardOptions.skillProficiencyLevels.map((value) => {
                  const checked = form.skillProficiencyLevels.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleMulti("skillProficiencyLevels", value)}
                      className={`rounded-none border px-3 py-1 text-xs ${
                        checked
                          ? "border-primary bg-primary text-white"
                          : "border-zinc-300 bg-white text-[color:var(--color-text)]"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-none border border-zinc-200 p-4">
              <p className="text-sm font-medium text-[color:var(--color-text)]">Learning objectives</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(skillOptions.length > 0 ? skillOptions : campaignWizardOptions.skills).map((skill) => {
                  const checked = form.skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleMulti("skills", skill)}
                      className={`rounded-none border px-3 py-1 text-xs ${
                        checked
                          ? "border-primary bg-primary text-white"
                          : "border-zinc-300 bg-white text-[color:var(--color-text)]"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-none border border-zinc-200 bg-surface p-4">
              <p className="text-sm font-medium text-[color:var(--color-text)]">Review</p>
              <div className="mt-3 space-y-2 text-xs text-zinc-600">
                <p>
                  <span className="font-medium text-[color:var(--color-text)]">Campaign:</span> {form.campaignName}
                </p>
                <p>
                  <span className="font-medium text-[color:var(--color-text)]">Type:</span> {form.campaignType}
                </p>
                <p>
                  <span className="font-medium text-[color:var(--color-text)]">Industry:</span> {form.industryType}
                </p>
                <p>
                  <span className="font-medium text-[color:var(--color-text)]">Markets:</span> {form.markets.join(", ")}
                </p>
                <p>
                  <span className="font-medium text-[color:var(--color-text)]">Roles:</span> {form.roles.join(", ")}
                </p>
                <p>
                  <span className="font-medium text-[color:var(--color-text)]">Employee Levels:</span> {form.levels.join(", ")}
                </p>
                <p>
                  <span className="font-medium text-[color:var(--color-text)]">Languages:</span> {form.languages.join(", ")}
                </p>
                <p>
                  <span className="font-medium text-[color:var(--color-text)]">Skill Proficiency:</span> {form.skillProficiencyLevels.join(", ")}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {saved ? (
          <div className="rounded-none border border-zinc-300 bg-footer px-4 py-3 text-sm text-[color:var(--color-text)]">
            {saveSource === "supabase"
              ? "Campaign saved to Supabase."
              : "Campaign draft saved locally. In a connected environment this would persist to Supabase."}
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep((value) => Math.max(value - 1, 0))}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button type="button" variant="secondary" onClick={() => void nextStep()} disabled={saving}>
            {saving ? "Saving..." : step === 2 ? "Save Campaign" : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
