import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/AuthLayout";
import { AuthPanel } from "@/components/AuthPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGoogleAuthUrl, login, loginSchema } from "@/lib/api/auth.functions";
import { consumeAuthReturnPath, safeLocalPath, saveAuthReturnPath } from "@/lib/booking-cart";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" ? safeLocalPath(search.next) : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    try {
      setIsSubmitting(true);
      await login({ data: parsed.data });
      toast.success("Welcome back.");
      const savedNext = consumeAuthReturnPath();
      const next = safeLocalPath(search.next || savedNext);
      if (next === "/dashboard") {
        await navigate({ to: "/dashboard" });
      } else {
        window.location.assign(next);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const continueWithGoogle = async () => {
    try {
      saveAuthReturnPath(search.next || "/dashboard");
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const result = await getGoogleAuthUrl({ data: { redirectUri } });
      window.location.assign(result.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google sign-in is not available.");
    }
  };

  return (
    <AuthLayout>
      <AuthPanel
        eyebrow="CQC compliance"
        title="Stress-free compliance for your dental practice"
        description="From mock inspections to fully managed compliance, Smart Dental Compliance & Training keeps your certificates, bookings, and action plans organised in one place."
      >
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold">Login</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            New here?{" "}
            <Link
              to="/signup"
              search={{ next: search.next }}
              className="font-semibold text-magenta"
            >
              Create an account
            </Link>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="mt-1"
              disabled={isSubmitting}
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs font-semibold text-magenta">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="mt-1"
              disabled={isSubmitting}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-full gradient-purple-orange text-white"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-full border-2"
          onClick={continueWithGoogle}
        >
          <Mail className="h-4 w-4" />
          Continue with Google
        </Button>
      </AuthPanel>
    </AuthLayout>
  );
}
