import { AppShell } from "@/components/app-shell";
import { getSessionUser } from "@/lib/session";
import { roleRedirect } from "@/lib/routes";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function ManagerLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getSessionUser();

  if (!session) {
    redirect("/");
  }

  if (session.role !== "learning_manager") {
    redirect(roleRedirect(session.role));
  }

  return <AppShell user={session}>{children}</AppShell>;
}
