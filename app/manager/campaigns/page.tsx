import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCampaignListWithStats } from "@/lib/platform-data";
import Link from "next/link";

function marketToFlag(market: string) {
  const normalized = market.trim().toLowerCase();
  const flags: Record<string, string> = {
    singapore: "🇸🇬",
    malaysia: "🇲🇾",
    thailand: "🇹🇭",
    australia: "🇦🇺",
    "hong kong": "🇭🇰",
    japan: "🇯🇵",
    apac: "🌏"
  };
  return flags[normalized] ?? market;
}

function getCampaignType(description: string) {
  const match = description.match(/Type:\s*(Exhaustive|Tailored)/i);
  if (!match?.[1]) return "Tailored";
  return match[1].toLowerCase() === "exhaustive" ? "Exhaustive" : "Tailored";
}

function getIndustryType(campaign: { description: string } & Record<string, unknown>) {
  const dbValue = typeof campaign.industry_type === "string" ? campaign.industry_type : null;
  if (dbValue) return dbValue;
  const match = campaign.description.match(/Industry:\s*([^\.]+)/i);
  return match?.[1]?.trim() ?? "Jewellery";
}

function getCampaignLanguages(campaign: { description: string } & Record<string, unknown>) {
  const dbValue = Array.isArray(campaign.target_languages) ? campaign.target_languages : null;
  if (dbValue && dbValue.length > 0) {
    return dbValue.map((value) => String(value));
  }

  const match = campaign.description.match(/Languages:\s*([^\.]+)/i);
  if (!match?.[1]) return ["English"];
  return match[1]
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function getCampaignProgress(startDate: string, endDate: string, status: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return status === "Published" ? 100 : 0;
  }
  const progress = ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
}

type CampaignsPageProps = {
  searchParams?: Promise<{
    q?: string;
    market?: string;
    type?: string;
    status?: string;
    role?: string;
  }>;
};

export default async function CampaignsPage({ searchParams }: CampaignsPageProps) {
  const params = (await searchParams) ?? {};
  const campaigns = await getCampaignListWithStats();
  const selectedQuery = (params.q ?? "").trim().toLowerCase();
  const selectedMarket = (params.market ?? "").trim();
  const selectedType = (params.type ?? "").trim();
  const selectedStatus = (params.status ?? "").trim();
  const selectedRole = (params.role ?? "").trim();
  const rows = campaigns.map((campaign) => ({
    ...campaign,
    campaignType: getCampaignType(campaign.description),
    industryType: getIndustryType(campaign),
    languages: getCampaignLanguages(campaign),
    progress: getCampaignProgress(campaign.start_date, campaign.end_date, campaign.status)
  }));
  const filteredRows = rows.filter((campaign) => {
    const matchesQuery =
      selectedQuery.length === 0 ||
      campaign.name.toLowerCase().includes(selectedQuery) ||
      campaign.description.toLowerCase().includes(selectedQuery);
    const matchesMarket = selectedMarket.length === 0 || campaign.target_market === selectedMarket;
    const matchesType = selectedType.length === 0 || campaign.campaignType === selectedType;
    const matchesStatus = selectedStatus.length === 0 || campaign.status === selectedStatus;
    const matchesRole = selectedRole.length === 0 || campaign.target_role === selectedRole;
    return matchesQuery && matchesMarket && matchesType && matchesStatus && matchesRole;
  });
  const marketOptions = Array.from(new Set(rows.map((campaign) => campaign.target_market))).sort();
  const roleOptions = Array.from(new Set(rows.map((campaign) => campaign.target_role))).sort();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <CardHeader className="flex flex-col gap-4 px-0 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="font-display text-3xl">Campaign list</CardTitle>
            <CardDescription>Published learning journeys currently live in the region.</CardDescription>
          </div>
          <Link
            href="/manager/campaigns/new"
            className="inline-flex h-11 items-center justify-center rounded-none border border-primary bg-transparent px-5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            New campaign
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <form className="grid gap-2.5 md:grid-cols-5">
            <input
              type="text"
              name="q"
              defaultValue={selectedQuery}
              placeholder="Search campaigns"
              className="h-9 rounded-none border border-primary bg-white px-3 text-xs text-[color:var(--color-text)] outline-none"
            />
            <select
              name="market"
              defaultValue={selectedMarket}
              className="h-9 rounded-none border border-primary bg-white px-3 text-xs text-[color:var(--color-text)] outline-none"
            >
              <option value="">All markets</option>
              {marketOptions.map((market) => (
                <option key={market} value={market}>
                  {market}
                </option>
              ))}
            </select>
            <select
              name="type"
              defaultValue={selectedType}
              className="h-9 rounded-none border border-primary bg-white px-3 text-xs text-[color:var(--color-text)] outline-none"
            >
              <option value="">All types</option>
              <option value="Exhaustive">Exhaustive</option>
              <option value="Tailored">Tailored</option>
            </select>
            <select
              name="status"
              defaultValue={selectedStatus}
              className="h-9 rounded-none border border-primary bg-white px-3 text-xs text-[color:var(--color-text)] outline-none"
            >
              <option value="">All status</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
            <select
              name="role"
              defaultValue={selectedRole}
              className="h-9 rounded-none border border-primary bg-white px-3 text-xs text-[color:var(--color-text)] outline-none"
            >
              <option value="">All roles</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <div className="md:col-span-5 flex items-center gap-2">
              <button
                type="submit"
                className="inline-flex h-8 items-center rounded-none border border-primary bg-transparent px-3 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Apply filters
              </button>
              <Link
                href="/manager/campaigns"
                className="inline-flex h-8 items-center rounded-none border border-primary bg-transparent px-3 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Reset
              </Link>
            </div>
          </form>
        </CardContent>
        <CardContent className="space-y-3 px-0 pt-0">
          {filteredRows.map((campaign) => (
            <div
              key={campaign.id}
              className="grid items-center gap-2 rounded-none border border-zinc-200 bg-white px-3 py-2.5 md:grid-cols-[1.8fr_auto_auto_auto_auto]"
            >
              <div>
                <p className="text-sm font-medium text-[color:var(--color-text)]">{campaign.name}</p>
                <div className="mt-1 grid gap-x-3 gap-y-0.5 text-xs text-zinc-500 md:grid-cols-2">
                  <p><span className="text-[color:var(--color-text)]">Role:</span> {campaign.target_role}</p>
                  <p><span className="text-[color:var(--color-text)]">Industry:</span> {campaign.industryType}</p>
                  <p><span className="text-[color:var(--color-text)]">Languages:</span> {campaign.languages.join(", ")}</p>
                  <p><span className="text-[color:var(--color-text)]">Employees:</span> {campaign.employeeCount}</p>
                </div>
              </div>
              <Badge title={campaign.target_market} className="rounded-none border-primary bg-white text-primary">
                {marketToFlag(campaign.target_market)}
              </Badge>
              <Badge className="rounded-none border-zinc-300 bg-surface text-[color:var(--color-text)]">
                {campaign.campaignType}
              </Badge>
              <p className="text-sm font-medium leading-none text-primary">{campaign.progress}% Completed</p>
              <div className="flex items-center gap-2">
                <Link
                  href={`/manager/campaigns/${campaign.id}`}
                  className="inline-flex h-8 items-center rounded-none border border-primary bg-transparent px-3 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  View
                </Link>
                <Link
                  href={`/manager/campaigns/${campaign.id}/edit`}
                  className="inline-flex h-8 items-center rounded-none border border-primary bg-transparent px-3 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
          {filteredRows.length === 0 ? (
            <div className="rounded-none border border-zinc-200 bg-white px-4 py-4 text-sm text-zinc-500">
              No campaigns match the selected filters.
            </div>
          ) : null}
        </CardContent>
      </div>
    </div>
  );
}
