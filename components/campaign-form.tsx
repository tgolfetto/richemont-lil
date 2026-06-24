"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { campaignWizardOptions } from "@/lib/mock-data";
import type { CampaignFormValues, SkillProficiencyLevel } from "@/lib/types";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

type CampaignFormProps = {
  campaign: CampaignFormValues;
  campaignId?: string;
  submitLabel: string;
  title: string;
  description: string;
  readOnlyStatus?: boolean;
  skillOptions?: string[];
};

export function CampaignForm({
  campaignId,
  campaign: initialCampaign,
  submitLabel,
  title,
  description,
  readOnlyStatus = false,
  skillOptions
}: CampaignFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<CampaignFormValues>(initialCampaign);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const roleOptions = useMemo(
    () =>
      campaignWizardOptions.roleHierarchy.flatMap((group) =>
        group.categories.flatMap((category) =>
          category.roles.map((role) => `${category.name} · ${role}`)
        )
      ),
    []
  );
  const marketOptions = useMemo(
    () =>
      Array.from(
        new Set(
          campaignWizardOptions.marketHierarchy.flatMap((group) => [
            group.group,
            ...group.markets
          ])
        )
      ),
    []
  );
  const skillPool = (skillOptions && skillOptions.length > 0 ? skillOptions : campaignWizardOptions.skills)
    .slice()
    .sort((left, right) => left.localeCompare(right));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch(campaignId ? `/api/campaigns/${campaignId}` : "/api/campaigns", {
        method: campaignId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const payload = (await response.json()) as { success: boolean; message?: string };

      if (!response.ok || !payload.success) {
        throw new Error(payload.message ?? "Unable to save campaign.");
      }

      setSaved(true);
      router.refresh();
      if (campaignId) {
        router.push(`/manager/campaigns/${campaignId}`);
      } else {
        router.push("/manager/campaigns");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save campaign.");
    } finally {
      setSaving(false);
    }
  }

  function updateField(field: keyof CampaignFormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value } as CampaignFormValues));
  }

  function updateMulti(
    field: "target_levels" | "target_languages",
    values: string[]
  ) {
    setForm((current) => ({ ...current, [field]: values } as CampaignFormValues));
  }

  function updateSkillTarget(index: number, field: "skill_name" | "proficiency", value: string) {
    setForm((current) => ({
      ...current,
      skill_targets: current.skill_targets.map((target, targetIndex) =>
        targetIndex === index
          ? {
              ...target,
              [field]:
                field === "proficiency"
                  ? (value as SkillProficiencyLevel)
                  : value
            }
          : target
      )
    }));
  }

  function addSkillTarget() {
    const defaultSkill = skillPool.find((skill) => !form.skill_targets.some((target) => target.skill_name === skill)) ?? skillPool[0] ?? "Leadership";
    setForm((current) => ({
      ...current,
      skill_targets: [
        ...current.skill_targets,
        { skill_name: defaultSkill, proficiency: "Intermediate" }
      ]
    }));
  }

  function removeSkillTarget(index: number) {
    setForm((current) => ({
      ...current,
      skill_targets: current.skill_targets.filter((_, targetIndex) => targetIndex !== index)
    }));
  }

  async function handleDeleteCampaign() {
    if (!campaignId) return;
    const confirmed = window.confirm(
      "Delete this campaign? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "DELETE"
      });
      const payload = (await response.json()) as { success: boolean; message?: string };

      if (!response.ok || !payload.success) {
        throw new Error(payload.message ?? "Unable to delete campaign.");
      }

      router.refresh();
      router.push("/manager/campaigns");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete campaign.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-light text-[color:var(--color-text)]">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-none border border-zinc-200 bg-white px-3 py-3 md:col-span-2">
            <Label htmlFor="name">Campaign name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </div>

          <div className="rounded-none border border-zinc-200 bg-white px-3 py-3">
            <Label htmlFor="target_role">Target role</Label>
            <select
              id="target_role"
              value={form.target_role}
              onChange={(event) => updateField("target_role", event.target.value)}
              className="h-11 w-full rounded-none border border-primary bg-white px-4 text-sm text-[color:var(--color-text)] outline-none"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-none border border-zinc-200 bg-white px-3 py-3">
            <Label htmlFor="target_market">Target market</Label>
            <select
              id="target_market"
              value={form.target_market}
              onChange={(event) => updateField("target_market", event.target.value)}
              className="h-11 w-full rounded-none border border-primary bg-white px-4 text-sm text-[color:var(--color-text)] outline-none"
            >
              {marketOptions.map((market) => (
                <option key={market} value={market}>
                  {market}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-none border border-zinc-200 bg-white px-3 py-3">
            <Label htmlFor="campaign_type">Campaign type</Label>
            <select
              id="campaign_type"
              value={form.campaign_type}
              onChange={(event) => updateField("campaign_type", event.target.value)}
              className="h-11 w-full rounded-none border border-primary bg-white px-4 text-sm text-[color:var(--color-text)] outline-none"
            >
              {campaignWizardOptions.campaignTypes.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-none border border-zinc-200 bg-white px-3 py-3">
            <Label htmlFor="industry_type">Industry type</Label>
            <select
              id="industry_type"
              value={form.industry_type}
              onChange={(event) => updateField("industry_type", event.target.value)}
              className="h-11 w-full rounded-none border border-primary bg-white px-4 text-sm text-[color:var(--color-text)] outline-none"
            >
              {campaignWizardOptions.industries.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-none border border-zinc-200 bg-white px-3 py-3">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={form.status}
              disabled={readOnlyStatus}
              onChange={(event) => updateField("status", event.target.value)}
              className="h-11 w-full rounded-none border border-primary bg-white px-4 text-sm text-[color:var(--color-text)] outline-none disabled:bg-zinc-50"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="rounded-none border border-zinc-200 bg-white px-3 py-3">
            <Label htmlFor="start_date">Start date</Label>
            <Input
              id="start_date"
              type="date"
              value={form.start_date}
              onChange={(event) => updateField("start_date", event.target.value)}
            />
          </div>

          <div className="rounded-none border border-zinc-200 bg-white px-3 py-3">
            <Label htmlFor="end_date">End date</Label>
            <Input
              id="end_date"
              type="date"
              value={form.end_date}
              onChange={(event) => updateField("end_date", event.target.value)}
            />
          </div>

          <div className="rounded-none border border-zinc-200 bg-white px-3 py-3 md:col-span-2">
            <Label htmlFor="target_levels">Employee levels</Label>
            <select
              id="target_levels"
              multiple
              value={form.target_levels}
              onChange={(event) => {
                updateMulti(
                  "target_levels",
                  Array.from(event.target.selectedOptions).map((option) => option.value)
                );
              }}
              className="min-h-24 w-full rounded-none border border-primary bg-white px-3 py-2 text-xs text-[color:var(--color-text)] outline-none"
            >
              {campaignWizardOptions.levels.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-none border border-zinc-200 bg-white px-3 py-3 md:col-span-2">
            <Label htmlFor="target_languages">Languages</Label>
            <select
              id="target_languages"
              multiple
              value={form.target_languages}
              onChange={(event) => {
                updateMulti(
                  "target_languages",
                  Array.from(event.target.selectedOptions).map((option) => option.value)
                );
              }}
              className="min-h-24 w-full rounded-none border border-primary bg-white px-3 py-2 text-xs text-[color:var(--color-text)] outline-none"
            >
              {campaignWizardOptions.languages.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-none border border-zinc-200 bg-white px-3 py-3 md:col-span-2 xl:col-span-4">
            <div className="mb-2 flex items-center justify-between">
              <Label>Skills and proficiency targets</Label>
              <Button type="button" variant="secondary" size="sm" onClick={addSkillTarget}>
                Add skill
              </Button>
            </div>
            <div className="space-y-2">
              {form.skill_targets.map((target, index) => (
                <div key={`${target.skill_name}-${index}`} className="grid gap-2 md:grid-cols-[1.8fr_1.2fr_auto]">
                  <select
                    value={target.skill_name}
                    onChange={(event) => updateSkillTarget(index, "skill_name", event.target.value)}
                    className="h-10 rounded-none border border-primary bg-white px-3 text-sm text-[color:var(--color-text)] outline-none"
                  >
                    {skillPool.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                  <select
                    value={target.proficiency}
                    onChange={(event) => updateSkillTarget(index, "proficiency", event.target.value)}
                    className="h-10 rounded-none border border-primary bg-white px-3 text-sm text-[color:var(--color-text)] outline-none"
                  >
                    {campaignWizardOptions.skillProficiencyLevels.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <Button type="button" variant="secondary" size="sm" onClick={() => removeSkillTarget(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-none border border-zinc-200 bg-white px-3 py-3 md:col-span-2 xl:col-span-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-none border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {saved ? (
          <div className="rounded-none border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Campaign saved successfully.
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <div>
            {campaignId ? (
              <Button
                type="button"
                variant="secondary"
                disabled={saving || deleting}
                onClick={handleDeleteCampaign}
                className="border-red-700 text-red-700 hover:bg-red-700 hover:text-white"
              >
                {deleting ? "Deleting..." : "Delete campaign"}
              </Button>
            ) : null}
          </div>
          <Button type="submit" variant="secondary" disabled={saving || deleting}>
            {saving ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
