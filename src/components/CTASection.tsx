import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection({
  title = "Ready to get compliant?",
  subtitle = "Book a free call or build your bespoke compliance package in minutes.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl gradient-hero p-10 text-white shadow-glow sm:p-16">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
            <p className="mt-3 max-w-xl text-white/90">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-magenta hover:bg-white/90"
            >
              <Link to="/book" search={{ service: "consultation" }}>
                Book Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-2 border-white bg-transparent text-white hover:bg-white/10"
            >
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
