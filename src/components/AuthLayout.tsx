import type { ReactNode } from "react";

import { CookieBanner } from "@/components/CookieBanner";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <CookieBanner />
      <Toaster richColors position="top-center" />
    </div>
  );
}
