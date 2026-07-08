import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("sdct-cookie-ack")) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-3 rounded-2xl border border-border bg-background p-4 shadow-card sm:flex-row sm:items-center">
        <p className="text-sm text-muted-foreground">
          We use essential cookies to make this site work and analytics cookies to improve it. See our{" "}
          <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="rounded-full" onClick={() => { localStorage.setItem("sdct-cookie-ack", "essential"); setShow(false); }}>Essential only</Button>
          <Button className="rounded-full gradient-purple-orange text-white" onClick={() => { localStorage.setItem("sdct-cookie-ack", "all"); setShow(false); }}>Accept all</Button>
        </div>
      </div>
    </div>
  );
}
