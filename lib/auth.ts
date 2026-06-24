import { mockUsers } from "@/lib/mock-data";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { SessionUser, Role, User } from "@/lib/types";

function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    department: user.department,
    job_title: user.job_title,
    market: user.market,
    proficiency_level: user.proficiency_level ?? null
  };
}

export async function findUserByCredentials(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("password", password)
      .maybeSingle();

    if (!error && data) {
      return toSessionUser(data as User);
    }
  }

  const fallback = mockUsers.find(
    (user) => user.email.toLowerCase() === normalizedEmail && user.password === password
  );

  return fallback ? toSessionUser(fallback) : null;
}

export function normalizeRole(role: string): Role | null {
  return role === "learning_manager" || role === "employee" ? role : null;
}
