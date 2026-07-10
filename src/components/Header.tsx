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

const DESKTOP_NAV = [
  { to: "/", label: "Home" },
  { to: "/packages", label: "Packages" },
  { to: "/squat-practices", label: "Squat Practices" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const PRICING_MENU = [
  { to: "/services", label: "Services" },
  { to: "/build-your-package", label: "Build Your Package" },
] as const;

const desktopLinkClass =
  "rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";
const desktopActiveLinkClass =
  "rounded-full px-3 py-2 text-sm font-semibold text-foreground bg-muted";
const desktopPricingLinkClass =
  "inline-flex items-center rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";
const desktopPricingActiveLinkClass =
  "inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold text-foreground bg-muted";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0" aria-label="Smart Dental Compliance & Training home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {DESKTOP_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={desktopLinkClass}
              activeProps={{ className: desktopActiveLinkClass }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}

          <div className="group relative">
            <Link
              to="/pricing"
              className={desktopPricingLinkClass}
              activeProps={{ className: desktopPricingActiveLinkClass }}
            >
              Pricing{" "}
              <span className="ml-1 text-xs transition-transform group-hover:-translate-y-px">
                ^
              </span>
            </Link>

            <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="w-[280px] rounded-2xl border bg-popover p-3 text-popover-foreground shadow-xl">
                <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t bg-popover" />
                <div className="space-y-1">
                  {PRICING_MENU.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" className="rounded-full border-2">
            <Link to="/build-your-package">Build Your Package</Link>
          </Button>
          <Button
            asChild
            className="rounded-full gradient-purple-orange text-white shadow-soft hover:opacity-95"
          >
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
              <Button
                asChild
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => setOpen(false)}
              >
                <Link to="/build-your-package">Build Package</Link>
              </Button>
              <Button
                asChild
                className="flex-1 rounded-full gradient-purple-orange text-white"
                onClick={() => setOpen(false)}
              >
                <Link to="/book">Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
