"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { campaignWizardOptions } from "@/lib/mock-data";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

const stepTitles = ["Campaign details", "Target audience", "Learning objectives"];

type WizardState = {
  campaignName: string;
  description: string;
  startDate: string;
  endDate: string;
  markets: string[];
  roles: string[];
  levels: string[];
  languages: string[];
  skills: string[];
};

const initialState: WizardState = {
  campaignName: "Retail Leadership Excellence 2026",
  description:
    "A luxury retail capability journey focused on leadership presence, accountability, and coaching.",
  startDate: "2026-02-01",
  endDate: "2026-12-31",
  markets: ["Singapore", "Malaysia"],
  roles: ["Boutique Manager"],
  levels: ["Manager"],
  languages: ["English"],
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

  function toggleMulti(selectKey: keyof Pick<WizardState, "markets" | "roles" | "levels" | "languages" | "skills">, value: string) {
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
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-zinc-100 bg-gradient-to-r from-gold-50 to-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="font-display text-3xl">Create Campaign</CardTitle>
            <CardDescription className="max-w-2xl">
              Multi-step wizard for digitizing the Excel-based learning mapping process.
            </CardDescription>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-gold-200 bg-white px-4 py-2 text-sm text-gold-700 md:flex">
            <Sparkles className="h-4 w-4" />
            {activeStep}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        <div className="grid gap-3 md:grid-cols-3">
          {stepTitles.map((title, index) => {
            const current = index === step;
            const complete = index < step;
            return (
              <div
                key={title}
                className={`rounded-[1.35rem] border px-4 py-4 ${
                  current ? "border-zinc-950 bg-zinc-950 text-white" : complete ? "border-gold-200 bg-gold-50" : "border-zinc-200 bg-white"
                }`}
              >
                <p className={`text-xs uppercase tracking-[0.24em] ${current ? "text-gold-300" : "text-zinc-500"}`}>
                  Step {index + 1}
                </p>
                <p className="mt-2 font-medium">{title}</p>
              </div>
            );
          })}
        </div>

        {step === 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                value={form.campaignName}
                onChange={(event) => setForm({ ...form, campaignName: event.target.value })}
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(event) => setForm({ ...form, endDate: event.target.value })}
                />
              </div>
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
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                title: "Markets",
                values: campaignWizardOptions.markets,
                key: "markets" as const
              },
              {
                title: "Roles",
                values: campaignWizardOptions.roles,
                key: "roles" as const
              },
              {
                title: "Employee Level",
                values: campaignWizardOptions.levels,
                key: "levels" as const
              },
              {
                title: "Language",
                values: campaignWizardOptions.languages,
                key: "languages" as const
              }
            ].map((group) => (
              <div key={group.title} className="rounded-[1.5rem] border border-zinc-200 p-5">
                <p className="text-sm font-semibold text-zinc-950">{group.title}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {group.values.map((value) => {
                    const checked = form[group.key].includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleMulti(group.key, value)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          checked
                            ? "border-zinc-950 bg-zinc-950 text-white"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-gold-300 hover:bg-gold-50"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-zinc-200 p-5">
              <p className="text-sm font-semibold text-zinc-950">Learning Objectives</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {(skillOptions.length > 0 ? skillOptions : campaignWizardOptions.skills).map((skill) => {
                  const checked = form.skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleMulti("skills", skill)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        checked
                          ? "border-gold-500 bg-gold-500 text-white"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-gold-300 hover:bg-gold-50"
                      }`}
                    >
                      {checked ? <Check className="mr-2 inline h-4 w-4" /> : null}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-sm font-semibold text-zinc-950">Review</p>
              <div className="mt-4 space-y-3 text-sm text-zinc-600">
                <p>
                  <span className="font-medium text-zinc-950">Campaign:</span> {form.campaignName}
                </p>
                <p>
                  <span className="font-medium text-zinc-950">Markets:</span> {form.markets.join(", ")}
                </p>
                <p>
                  <span className="font-medium text-zinc-950">Roles:</span> {form.roles.join(", ")}
                </p>
                <p>
                  <span className="font-medium text-zinc-950">Skills:</span> {form.skills.join(", ")}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {saved ? (
          <div className="rounded-[1.5rem] border border-gold-200 bg-gold-50 px-5 py-4 text-sm text-gold-800">
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
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button type="button" variant="gold" onClick={() => void nextStep()} disabled={saving}>
            {saving ? "Saving..." : step === 2 ? "Save Campaign" : "Continue"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
