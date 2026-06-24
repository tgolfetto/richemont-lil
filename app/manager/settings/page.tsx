import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/section-heading";
import { LogoutButton } from "@/components/logout-button";
import { hasSupabaseConnection } from "@/lib/supabase";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Settings"
        title="Workspace preferences"
        description="A lightweight internal settings surface for the mockup and demo story."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-3xl">Account</CardTitle>
            <CardDescription>Manage the signed-in learning manager identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <p className="text-sm text-zinc-600">
              This prototype uses cookie-based mock authentication, so there is no external identity provider
              involved.
            </p>
            <Badge
              className={
                hasSupabaseConnection
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-gold-200 bg-gold-50 text-gold-800"
              }
            >
              {hasSupabaseConnection ? "Supabase connected" : "Local fallback mode"}
            </Badge>
            <LogoutButton />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-3xl">Environment</CardTitle>
            <CardDescription>What the app expects from Supabase when connected.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-6 text-sm text-zinc-600">
            <p>Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for server-side validation.</p>
            <p>The app falls back to seeded mock data if those variables are not present.</p>
            <Button variant="secondary" size="sm">
              Connected mockup
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
