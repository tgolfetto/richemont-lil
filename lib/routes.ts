import type { Role } from "@/lib/types";

export function roleRedirect(role: Role) {
  return role === "learning_manager" ? "/manager/dashboard" : "/employee/dashboard";
}

