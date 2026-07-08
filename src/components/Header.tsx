import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/packages", label: "Packages" },
  { to: "/services", label: "Services" },
  { to: "/squat-practices", label: "Squat Practices" },
  { to: "/pricing", label: "Pricing" },
  { to: "/build-your-package", label: "Build Your Package" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0" aria-label="Smart Dental Compliance & Training home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "rounded-full px-3 py-2 text-sm font-semibold text-foreground bg-muted" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" className="rounded-full border-2">
            <Link to="/build-your-package">Build Your Package</Link>
          </Button>
          <Button asChild className="rounded-full gradient-purple-orange text-white shadow-soft hover:opacity-95">
            <Link to="/book">Book Now</Link>
          </Button>
        </div>

        <button
          className="rounded-md p-2 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" className="flex-1 rounded-full" onClick={() => setOpen(false)}>
                <Link to="/build-your-package">Build Package</Link>
              </Button>
              <Button asChild className="flex-1 rounded-full gradient-purple-orange text-white" onClick={() => setOpen(false)}>
                <Link to="/book">Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
