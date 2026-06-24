"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roleRedirect } from "@/lib/routes";
import { ArrowRight, KeyRound, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

type LoginPreset = {
  email: string;
  password: string;
  label: string;
};

const presets: LoginPreset[] = [
  { email: "manager@richemont.com", password: "admin123", label: "Learning manager" },
  { email: "employee@richemont.com", password: "employee123", label: "Employee" }
];

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const payload = (await response.json()) as {
        success: boolean;
        role?: "learning_manager" | "employee";
        message?: string;
      };

      if (!response.ok || !payload.success || !payload.role) {
        throw new Error(payload.message ?? "Invalid email or password.");
      }

      router.push(roleRedirect(payload.role));
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="overflow-hidden border-zinc-200/80 bg-white/90 shadow-luxury backdrop-blur">
      <CardHeader className="border-b border-zinc-100 bg-gradient-to-r from-gold-50 to-white">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
          <Sparkles className="h-5 w-5 text-gold-300" />
        </div>
        <CardTitle className="text-3xl font-display tracking-wide">Sign in to your workspace</CardTitle>
        <CardDescription className="text-sm">
          Authenticate with the mock Supabase users table to reach the manager or employee dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@richemont.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            <KeyRound className="h-4 w-4" />
            {submitting ? "Authenticating..." : "Enter platform"}
            {!submitting ? <ArrowRight className="h-4 w-4" /> : null}
          </Button>
        </form>

        <div className="grid gap-3 sm:grid-cols-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setEmail(preset.email);
                setPassword(preset.password);
              }}
              className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50 px-4 py-4 text-left transition hover:border-gold-300 hover:bg-gold-50"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{preset.label}</p>
              <p className="mt-2 text-sm font-medium text-zinc-950">{preset.email}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
