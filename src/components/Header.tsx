import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Menu, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout } from "@/lib/api/auth.functions";
import { bookingCartCount, loadBookingCart, subscribeToBookingCart } from "@/lib/booking-cart";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/packages", label: "Packages" },
  { to: "/squat-practices", label: "Squat Practices" },
  { to: "/pricing", label: "Pricing" },
  { to: "/build-your-package", label: "Build Your own Package" },
  { to: "/resources", label: "Resources" },
  { to: "/contact", label: "Contact" },
] as const;

const DESKTOP_NAV = [
  { to: "/", label: "Home" },
  { to: "/packages", label: "Packages" },
  { to: "/squat-practices", label: "Squat Practices" },
  { to: "/resources", label: "Resources" },
  { to: "/contact", label: "Contact" },
] as const;

const desktopLinkClass =
  "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";
const desktopActiveLinkClass =
  "whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-foreground bg-muted";

export function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const refreshCart = () => setCartCount(bookingCartCount(loadBookingCart()));
    refreshCart();
    const unsubscribe = subscribeToBookingCart(refreshCart);

    getCurrentUser()
      .then((result) => {
        if (isMounted) {
          setIsLoggedIn(Boolean(result.user));
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoggedIn(false);
        }
      });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const onLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setOpen(false);
    toast.success("Logged out.");
    await navigate({ to: "/" });
  };

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
          <Link
            to="/pricing"
            className={desktopLinkClass}
            activeProps={{ className: desktopActiveLinkClass }}
          >
            Pricing
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" className="rounded-full border-2">
            <Link to="/build-your-package" search={{ selection: undefined }}>
              Build Your own Package
            </Link>
          </Button>
          <Button
            asChild
            className="relative rounded-full gradient-purple-orange text-white shadow-soft hover:opacity-95"
          >
            <Link to="/book">
              <ShoppingBag className="h-4 w-4" />
              Booking cart
              {cartCount > 0 ? (
                <span className="grid min-w-5 place-items-center rounded-full bg-white px-1.5 text-[11px] font-extrabold text-magenta">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-2">
            <Link to={isLoggedIn ? "/dashboard" : "/login"}>
              {isLoggedIn ? "Dashboard" : "Login"}
            </Link>
          </Button>
          {isLoggedIn ? (
            <Button variant="ghost" className="rounded-full" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : null}
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
                <Link to="/build-your-package" search={{ selection: undefined }}>
                  Build Package
                </Link>
              </Button>
              <Button
                asChild
                className="flex-1 rounded-full gradient-purple-orange text-white"
                onClick={() => setOpen(false)}
              >
                <Link to="/book">
                  <ShoppingBag className="h-4 w-4" />
                  Cart {cartCount > 0 ? `(${cartCount})` : ""}
                </Link>
              </Button>
            </div>
            <Button
              asChild
              variant="outline"
              className="mt-2 w-full rounded-full border-2"
              onClick={() => setOpen(false)}
            >
              <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                {isLoggedIn ? "Dashboard" : "Login"}
              </Link>
            </Button>
            {isLoggedIn ? (
              <Button variant="ghost" className="w-full rounded-full" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
