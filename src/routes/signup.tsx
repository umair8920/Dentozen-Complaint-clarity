import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";

import { AuthLayout } from "@/components/AuthLayout";
import { AuthPanel } from "@/components/AuthPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authUserSchema, getGoogleAuthUrl, signup } from "@/lib/api/auth.functions";
import { syncPendingBookingSelection } from "@/lib/pending-booking";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const continueWithGoogle = async () => {
    try {
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const result = await getGoogleAuthUrl({ data: { redirectUri } });
      window.location.assign(result.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google signup is not available.");
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = authUserSchema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    try {
      setIsSubmitting(true);
      await signup({ data: parsed.data });
      try {
        await syncPendingBookingSelection();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Saved booking could not be synced.");
      }
      toast.success("Account created. Welcome email sent.");
      await navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthPanel
        eyebrow="Practice support"
        title="Bring your compliance work into one organised space"
        description="Create an account to keep dental compliance actions, training, bookings, certificates, and service updates easier to manage as your practice grows."
      >
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold">Signup</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-magenta">
              Login
            </Link>
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="mt-1"
              disabled={isSubmitting}
              required
            />
          </div>
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
            <Label htmlFor="password">Password</Label>
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
            {isSubmitting ? "Creating account..." : "Create account"}
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
