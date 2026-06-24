"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpenText,
  LayoutDashboard,
  Target
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

const managerNav: NavItem[] = [
  { href: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/manager/campaigns", label: "Campaigns", icon: Target },
  { href: "/manager/analytics", label: "Analytics", icon: BarChart3 }
];

const employeeNav: NavItem[] = [
  { href: "/employee/dashboard", label: "Courses", icon: LayoutDashboard },
  { href: "/employee/learning-path", label: "Learning Path", icon: BookOpenText }
];

type AppShellProps = {
  user: {
    full_name: string;
    role: "learning_manager" | "employee";
    department: string;
    job_title: string;
    market: string;
  };
  children: ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const nav = user.role === "learning_manager" ? managerNav : employeeNav;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="h-screen overflow-hidden bg-white text-zinc-950">
      <div className="mx-auto flex h-full max-w-[1600px]">
        <main className="flex min-h-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex-shrink-0 border-b border-zinc-200 bg-surface/85 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8 lg:px-10">
              <button
                onClick={() => setMobileMenuOpen((value) => !value)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-none border border-zinc-200 bg-surface text-[10px] font-medium leading-none text-zinc-950 lg:hidden"
                aria-label="Toggle menu"
              >
                Menu
              </button>

              <div className="hidden items-center gap-8 lg:flex">
                <Link href={user.role === "learning_manager" ? "/manager/dashboard" : "/employee/dashboard"}>
                  <div className="flex flex-col items-center">
                    <img
                      src="/richemont-logo.svg"
                      alt="Richemont"
                      className="h-7 w-auto object-contain"
                    />
                    <p className="mt-1 text-center text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                      Learning Recommendations
                    </p>
                  </div>
                </Link>

                <nav className="flex items-center gap-2">
                  {nav.map((item) => {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-none border border-transparent px-3 py-2 text-sm text-[color:var(--color-text)] transition hover:border-zinc-300"
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-zinc-950">{user.full_name}</p>
                  <p className="text-xs text-zinc-500">{user.job_title}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Sign out
                </Button>
              </div>
            </div>

            {mobileMenuOpen ? (
              <div className="border-t border-zinc-200 bg-surface px-4 py-4 lg:hidden">
                <Link href={user.role === "learning_manager" ? "/manager/dashboard" : "/employee/dashboard"}>
                  <img
                    src="/richemont-logo.svg"
                    alt="Richemont"
                    className="mb-4 h-6 w-auto object-contain"
                  />
                </Link>
                <div className="grid gap-2">
                  {nav.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-none px-4 py-3 text-sm font-medium",
                          active
                            ? "bg-zinc-950 text-white"
                            : "bg-zinc-50 text-zinc-700"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
