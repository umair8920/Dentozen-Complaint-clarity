import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/SiteLayout";
import { completeGoogleLogin } from "@/lib/api/auth.functions";
import { syncPendingBookingSelection } from "@/lib/pending-booking";

type GoogleSearch = {
  code?: string;
  state?: string;
};

export const Route = createFileRoute("/auth/google/callback")({
  validateSearch: (search: Record<string, unknown>): GoogleSearch => ({
    code: typeof search.code === "string" ? search.code : undefined,
    state: typeof search.state === "string" ? search.state : undefined,
  }),
  component: GoogleCallbackPage,
});

function GoogleCallbackPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    async function complete() {
      if (!search.code || !search.state) {
        toast.error("Google did not return the expected sign-in details.");
        await navigate({ to: "/login" });
        return;
      }

      try {
        await completeGoogleLogin({
          data: {
            code: search.code,
            state: search.state,
            redirectUri: `${window.location.origin}/auth/google/callback`,
          },
        });
        try {
          await syncPendingBookingSelection();
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Saved booking could not be synced.",
          );
        }
        toast.success("Signed in with Google.");
        await navigate({ to: "/dashboard" });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Google sign-in failed.");
        await navigate({ to: "/login" });
      }
    }

    void complete();
  }, [navigate, search.code, search.state]);

  return (
    <SiteLayout>
      <div className="grid min-h-[60vh] place-items-center px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-magenta" />
          <h1 className="mt-4 text-xl font-bold">Completing Google sign-in</h1>
        </div>
      </div>
    </SiteLayout>
  );
}
