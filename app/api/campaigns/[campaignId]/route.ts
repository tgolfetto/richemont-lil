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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
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

    const { campaignId } = await params;
    const body = (await request.json()) as {
      name?: string;
      description?: string;
      target_role?: string;
      target_market?: string;
      campaign_type?: "Exhaustive" | "Tailored";
      industry_type?: string;
      target_levels?: string[];
      target_languages?: string[];
      skill_targets?: Array<{ skill_name: string; proficiency: string }>;
      skill_proficiency_levels?: string[];
      status?: "Draft" | "Published" | "Archived";
      start_date?: string;
      end_date?: string;
    };

    if (!body.name || !body.description || !body.target_role || !body.target_market || !body.start_date || !body.end_date) {
      return NextResponse.json(
        { success: false, message: "Campaign details are incomplete." },
        { status: 400 }
      );
    }

    const effectiveSkillTargets = body.skill_targets ?? [];
    const effectiveSkills =
      effectiveSkillTargets.length > 0
        ? Array.from(new Set(effectiveSkillTargets.map((item) => item.skill_name)))
        : [];
    const effectiveSkillProficiency =
      effectiveSkillTargets.length > 0
        ? Array.from(new Set(effectiveSkillTargets.map((item) => item.proficiency)))
        : (body.skill_proficiency_levels ?? []);
    const skillMatrix =
      effectiveSkillTargets.length > 0
        ? effectiveSkillTargets.map((item) => `${item.skill_name}|${item.proficiency}`).join("; ")
        : null;
    const campaignDescription = stripMetadataFromDescription(body.description);

    const basePayload = {
      name: body.name,
      description: campaignDescription,
      target_role: body.target_role,
      target_market: body.target_market,
      status: body.status ?? "Draft",
      start_date: body.start_date,
      end_date: body.end_date
    };
    const extendedPayload = {
      ...basePayload,
      campaign_type: body.campaign_type ?? "Tailored",
      industry_type: body.industry_type ?? "Jewellery",
      target_levels: body.target_levels ?? [],
      target_languages: body.target_languages ?? [],
      skill_proficiency_levels: effectiveSkillProficiency,
      focus_skills: effectiveSkills,
      skill_matrix: skillMatrix
    };

    let { data, error } = await supabase
      .from("campaigns")
      .update(extendedPayload)
      .eq("id", campaignId)
      .select("*")
      .single();

    if (error && hasMissingColumnError(error.message)) {
      const fallback = await supabase
        .from("campaigns")
        .update(basePayload)
        .eq("id", campaignId)
        .select("*")
        .single();
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, campaign: data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to update campaign." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
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

    const { campaignId } = await params;

    const { error } = await supabase.from("campaigns").delete().eq("id", campaignId);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to delete campaign." },
      { status: 500 }
    );
  }
}
