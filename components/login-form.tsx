"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roleRedirect } from "@/lib/routes";
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

  function applyPreset(preset: LoginPreset) {
    setEmail(preset.email);
    setPassword(preset.password);
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-5 font-sans">
      <div className="flex justify-center">
        <img src="/richemont-logo.svg" alt="Richemont" className="h-7 w-auto object-contain" />
      </div>

      <div className="space-y-1 text-center">
        <p className="font-display text-2xl font-light tracking-wide text-[color:var(--color-text)]">
          Learning &amp; Development Platform
        </p>
      </div>

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
            className="rounded-none border-primary bg-transparent px-4 py-3"
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
            className="rounded-none border-primary bg-transparent px-4 py-3"
          />
        </div>

        {error ? (
          <div className="rounded-none border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? "Authenticating..." : "Enter platform"}
        </Button>
      </form>

      <div className="text-sm text-[color:var(--color-text)]">
        <span className="mr-2">Demo Account:</span>
        <button
          type="button"
          onClick={() => applyPreset(presets[0])}
          className="!border-0 !bg-transparent !p-0 text-sm underline underline-offset-4 transition-colors hover:!bg-transparent hover:!text-primary"
        >
          Learning Manager
        </button>
        <span className="mx-2">and</span>
        <button
          type="button"
          onClick={() => applyPreset(presets[1])}
          className="!border-0 !bg-transparent !p-0 text-sm underline underline-offset-4 transition-colors hover:!bg-transparent hover:!text-primary"
        >
          Employee
        </button>
      </div>
    </div>
  );
}
