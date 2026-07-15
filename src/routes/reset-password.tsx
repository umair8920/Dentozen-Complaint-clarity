import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/AuthLayout";
import { AuthPanel } from "@/components/AuthPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword, resetPasswordSchema } from "@/lib/api/auth.functions";

type ResetSearch = {
  token?: string;
};

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): ResetSearch => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = resetPasswordSchema.safeParse({ token: search.token ?? "", password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    try {
      setIsSubmitting(true);
      await resetPassword({ data: parsed.data });
      toast.success("Password updated. Taking you to your dashboard.");
      await navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Password reset failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthPanel
        eyebrow="Practice continuity"
        title="Create your password and open your dashboard"
        description="Once you are back in, you can continue managing compliance actions, upcoming bookings, and practice documents from your dashboard."
      >
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold">Reset password</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Need a new link?{" "}
            <Link to="/forgot-password" className="font-semibold text-magenta">
              Request reset
            </Link>
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1"
              disabled={isSubmitting}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !search.token}
            className="h-11 w-full rounded-full gradient-purple-orange text-white"
          >
            {isSubmitting ? "Updating..." : "Update password"}
          </Button>
        </form>
      </AuthPanel>
    </AuthLayout>
  );
}
