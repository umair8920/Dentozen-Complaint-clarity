import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

import { Logo } from "@/components/Logo";

export function AuthPanel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-96px)] bg-surface px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl gradient-hero p-7 text-white shadow-glow sm:p-10">
          <Logo />
          <div className="mt-12 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            {eyebrow}
          </div>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/88 sm:text-base">
            {description}
          </p>
          <div className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
            {[
              "CQC-ready support",
              "All compliance under one roof",
              "Certificates kept in one place",
              "Dental-specific expertise",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-white/13 p-4 backdrop-blur">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-background p-5 shadow-soft sm:p-7">
          {children}
        </section>
      </div>
    </div>
  );
}
