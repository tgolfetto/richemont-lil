"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpenText,
  CircleUserRound,
  Compass,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  Settings,
  Sparkles,
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
  { href: "/manager/recommendations", label: "Recommendations", icon: Lightbulb },
  { href: "/manager/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/manager/settings", label: "Settings", icon: Settings }
];

const employeeNav: NavItem[] = [
  { href: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employee/dashboard#learning-path", label: "Learning Path", icon: BookOpenText },
  { href: "/employee/dashboard#recommendations", label: "Recommendations", icon: Sparkles },
  { href: "/employee/dashboard#profile", label: "Profile", icon: CircleUserRound }
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
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const nav = user.role === "learning_manager" ? managerNav : employeeNav;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(180,151,90,0.1),_transparent_20%),linear-gradient(to_bottom,_#ffffff_0%,_#fcfbf7_100%)] text-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-80 shrink-0 border-r border-zinc-200 bg-white/80 px-6 py-8 backdrop-blur lg:flex lg:flex-col">
          <div className="mb-10 rounded-[2rem] border border-zinc-200 bg-white px-5 py-5 shadow-luxury">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                <Sparkles className="h-5 w-5 text-gold-300" />
              </div>
              <div>
                <p className="font-display text-xl leading-none tracking-[0.08em]">RICHEMONT</p>
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                  Learning Recommender
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-[2rem] bg-zinc-950 px-5 py-5 text-white shadow-luxury">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Signed in as</p>
            <p className="mt-3 text-lg font-semibold">{user.full_name}</p>
            <p className="mt-1 text-sm text-zinc-300">{user.job_title}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-gold-300">
              {user.department}
            </p>
          </div>

          <nav className="space-y-2">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-medium transition",
                    active
                      ? "bg-zinc-950 text-white shadow-luxury"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                  )}
                >
                  <Icon className={cn("h-4 w-4", active ? "text-gold-300" : "text-zinc-400")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[2rem] border border-gold-200 bg-gold-50 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-gold-700">Active market</p>
            <p className="mt-2 text-lg font-semibold text-zinc-950">{user.market}</p>
            <p className="mt-1 text-sm text-zinc-600">
              Personalized recommendations are aligned to this operating context.
            </p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/85 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8 lg:px-10">
              <button
                onClick={() => setMobileMenuOpen((value) => !value)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-950 lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden lg:block">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
                  Richemont Learning Recommendations
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Premium learning orchestration for internal teams.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-zinc-950">{user.full_name}</p>
                  <p className="text-xs text-zinc-500">{user.role.replace("_", " ")}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>

            {mobileMenuOpen ? (
              <div className="border-t border-zinc-200 bg-white px-4 py-4 lg:hidden">
                <div className="grid gap-2">
                  {nav.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium",
                          active
                            ? "bg-zinc-950 text-white"
                            : "bg-zinc-50 text-zinc-700"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </header>

          <div className="px-4 py-6 md:px-8 md:py-8 lg:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

