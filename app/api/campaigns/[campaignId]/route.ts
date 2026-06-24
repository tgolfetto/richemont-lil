import { getSupabaseAdminClient } from "@/lib/supabase";
import { getSessionUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

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
    const metadataParts = [
      body.campaign_type ? `Type: ${body.campaign_type}` : null,
      body.industry_type ? `Industry: ${body.industry_type}` : null,
      body.target_levels && body.target_levels.length > 0
        ? `Employee levels: ${body.target_levels.join(", ")}`
        : null,
      body.target_languages && body.target_languages.length > 0
        ? `Languages: ${body.target_languages.join(", ")}`
        : null,
      effectiveSkillProficiency.length > 0
        ? `Skill proficiency: ${effectiveSkillProficiency.join(", ")}`
        : null,
      effectiveSkills.length > 0 ? `Focus skills: ${effectiveSkills.join(", ")}` : null,
      skillMatrix ? `Skill matrix: ${skillMatrix}` : null
    ].filter(Boolean);
    const campaignDescription =
      metadataParts.length > 0
        ? `${body.description} ${metadataParts.join(". ")}.`
        : body.description;

    const { data, error } = await supabase
      .from("campaigns")
      .update({
        name: body.name,
        description: campaignDescription,
        target_role: body.target_role,
        target_market: body.target_market,
        status: body.status ?? "Draft",
        start_date: body.start_date,
        end_date: body.end_date
      })
      .eq("id", campaignId)
      .select("*")
      .single();

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
