import { LoginForm } from "@/components/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCampaigns, mockRecommendations } from "@/lib/mock-data";
import { ArrowUpRight, Crown, GraduationCap, Sparkles, Users } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(180,151,90,0.12),_transparent_18%),linear-gradient(to_bottom,_#ffffff_0%,_#fbfaf6_100%)]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-zinc-950 px-6 py-8 text-white shadow-luxury sm:px-10 sm:py-12">
          <div className="absolute inset-0 luxury-grid opacity-35" />
          <div className="absolute -right-10 top-6 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-zinc-950">
                  <Crown className="h-5 w-5 text-gold-600" />
                </div>
                <div>
                  <p className="font-display text-2xl tracking-[0.12em]">RICHEMONT</p>
                  <p className="text-xs uppercase tracking-[0.32em] text-zinc-400">
                    Learning Recommendations
                  </p>
                </div>
              </div>

              <div className="max-w-2xl space-y-6">
                <Badge className="border-gold-300 bg-white/10 text-gold-200">
                  <Sparkles className="mr-2 h-3.5 w-3.5" />
                  Digitizing the LinkedIn Learning mapping workflow
                </Badge>
                <h1 className="font-display text-5xl leading-none tracking-wide sm:text-6xl lg:text-7xl">
                  A luxury learning experience for Richemont teams.
                </h1>
                <p className="max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
                  A polished internal prototype for Cartier APAC that transforms the Excel-based
                  recommendation process into a premium, data-rich platform for managers and employees.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Campaigns managed", value: "12", icon: Sparkles },
                { label: "Employees reached", value: "3.2k", icon: Users },
                { label: "Learning completion", value: "74%", icon: GraduationCap }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.label} className="border-white/10 bg-white/5 text-white shadow-none">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-zinc-400">{item.label}</p>
                          <p className="mt-3 font-display text-4xl">{item.value}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                          <Icon className="h-5 w-5 text-gold-300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
              <span className="rounded-full border border-white/10 px-4 py-2">
                Responsive dashboard
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2">
                Supabase-backed login
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2">
                Analytics and campaign wizard
              </span>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full space-y-6">
            <LoginForm />

            <Card className="border-gold-200 bg-gold-50/60">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-gold-700">Demo data</p>
                    <p className="mt-2 font-medium text-zinc-950">
                      The prototype includes seeded users, campaigns, skills, courses, and recommendations.
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gold-700" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {mockCampaigns.slice(0, 2).map((campaign) => (
                    <div key={campaign.id} className="rounded-[1.35rem] bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Campaign</p>
                      <p className="mt-2 font-medium text-zinc-950">{campaign.name}</p>
                      <p className="mt-1 text-sm text-zinc-600">{campaign.status}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-[1.35rem] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Employee demo</p>
                  <p className="mt-2 font-medium text-zinc-950">Daniel Tan has {mockRecommendations.length} active recommendations.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

