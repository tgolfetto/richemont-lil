import { getSupabaseAdminClient } from "@/lib/supabase";
import { getSessionUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

function stripMetadataFromDescription(input: string) {
  return input
    .replace(/\s*Type:\s*[^.]+\./gi, "")
    .replace(/\s*Industry:\s*[^.]+\./gi, "")
    .replace(/\s*Employee levels:\s*[^.]+\./gi, "")
    .replace(/\s*Languages:\s*[^.]+\./gi, "")
    .replace(/\s*Skill proficiency:\s*[^.]+\./gi, "")
    .replace(/\s*Focus skills:\s*[^.]+\./gi, "")
    .replace(/\s*Skill matrix:\s*[^.]+\./gi, "")
    .trim();
}

function hasMissingColumnError(message?: string | null) {
  if (!message) return false;
  return (
    message.includes("Could not find the '") &&
    message.includes("' column of 'campaigns' in the schema cache")
  );
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    const supabase = getSupabaseAdminClient();

    if (!session || session.role !== "learning_manager") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!supabase) {
      return NextResponse.json(
        { success: false, message: "Supabase connection is not configured." },
        { status: 503 }
      );
    }

    const {
      campaignName,
      name,
      description,
      startDate,
      endDate,
      start_date,
      end_date,
      target_role,
      target_market,
      campaign_type,
      industry_type,
      target_levels,
      target_languages,
      skill_targets,
      status,
      markets,
      roles,
      levels,
      languages,
      skillProficiencyLevels,
      skills,
      campaignType,
      industryType
    } = (await request.json()) as {
      campaignName?: string;
      name?: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      start_date?: string;
      end_date?: string;
      target_role?: string;
      target_market?: string;
      campaign_type?: "Exhaustive" | "Tailored";
      industry_type?: string;
      target_levels?: string[];
      target_languages?: string[];
      skill_targets?: Array<{ skill_name: string; proficiency: string }>;
      status?: "Draft" | "Published" | "Archived";
      markets?: string[];
      roles?: string[];
      levels?: string[];
      languages?: string[];
      skillProficiencyLevels?: string[];
      skills?: string[];
      campaignType?: string;
      industryType?: string;
    };

    const finalName = campaignName ?? name;
    const finalStartDate = startDate ?? start_date;
    const finalEndDate = endDate ?? end_date;

    if (!finalName || !description || !finalStartDate || !finalEndDate) {
      return NextResponse.json(
        { success: false, message: "Campaign details are incomplete." },
        { status: 400 }
      );
    }

    const finalTargetMarket =
      target_market ?? (markets && markets.length > 0 ? markets.join(", ") : "APAC");
    const finalTargetRole = target_role ?? (roles && roles.length > 0 ? roles[0] : "Boutique Manager");
    const finalStatus = status ?? "Draft";
    const effectiveLevels = target_levels ?? levels ?? [];
    const effectiveLanguages = target_languages ?? languages ?? [];
    const effectiveSkillTargets = skill_targets ?? [];
    const effectiveSkillProficiencyLevels =
      effectiveSkillTargets.length > 0
        ? Array.from(new Set(effectiveSkillTargets.map((item) => item.proficiency)))
        : (skillProficiencyLevels ?? []);
    const effectiveSkills =
      effectiveSkillTargets.length > 0
        ? Array.from(new Set(effectiveSkillTargets.map((item) => item.skill_name)))
        : (skills ?? []);
    const skillMatrix =
      effectiveSkillTargets.length > 0
        ? effectiveSkillTargets.map((item) => `${item.skill_name}|${item.proficiency}`).join("; ")
        : null;

    const campaignDescription = stripMetadataFromDescription(description);

    const basePayload = {
      name: finalName,
      description: campaignDescription,
      target_role: finalTargetRole,
      target_market: finalTargetMarket,
      status: finalStatus,
      start_date: finalStartDate,
      end_date: finalEndDate,
      created_by: session.id
    };
    const extendedPayload = {
      ...basePayload,
      campaign_type: campaign_type ?? campaignType ?? "Tailored",
      industry_type: industry_type ?? industryType ?? "Jewellery",
      target_levels: effectiveLevels,
      target_languages: effectiveLanguages,
      skill_proficiency_levels: effectiveSkillProficiencyLevels,
      focus_skills: effectiveSkills,
      skill_matrix: skillMatrix
    };

    let { data, error } = await supabase
      .from("campaigns")
      .insert(extendedPayload)
      .select("*")
      .single();

    if (error && hasMissingColumnError(error.message)) {
      const fallback = await supabase
        .from("campaigns")
        .insert(basePayload)
        .select("*")
        .single();
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, campaign: data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to create campaign." },
      { status: 500 }
    );
  }
}
