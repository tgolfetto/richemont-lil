import { getSupabaseAdminClient } from "@/lib/supabase";
import { getSessionUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

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
      description,
      startDate,
      endDate,
      markets,
      roles,
      skills
    } = (await request.json()) as {
      campaignName?: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      markets?: string[];
      roles?: string[];
      skills?: string[];
    };

    if (!campaignName || !description || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: "Campaign details are incomplete." },
        { status: 400 }
      );
    }

    const targetMarket = markets && markets.length > 0 ? markets.join(", ") : "APAC";
    const targetRole = roles && roles.length > 0 ? roles[0] : "Boutique Manager";
    const campaignDescription =
      skills && skills.length > 0
        ? `${description} Focus skills: ${skills.join(", ")}.`
        : description;

    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        name: campaignName,
        description: campaignDescription,
        target_role: targetRole,
        target_market: targetMarket,
        status: "Draft",
        start_date: startDate,
        end_date: endDate,
        created_by: session.id
      })
      .select("*")
      .single();

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

