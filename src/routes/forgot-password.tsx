import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/AuthLayout";
import { AuthPanel } from "@/components/AuthPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword, forgotPasswordSchema } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    try {
      setIsSubmitting(true);
      await forgotPassword({ data: parsed.data });
      toast.success("If that email exists, a reset link has been sent.");
      setEmail("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Password reset email failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthPanel
        eyebrow="Compliance workspace"
        title="Get back to your dental compliance dashboard"
        description="Your account helps keep compliance activity, training records, bookings, and certificates easier to find when inspection preparation gets busy."
      >
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold">Forgot password</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link to="/login" search={{ next: undefined }} className="font-semibold text-magenta">
              Login
            </Link>
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
            {isSubmitting ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </AuthPanel>
    </AuthLayout>
  );
}
