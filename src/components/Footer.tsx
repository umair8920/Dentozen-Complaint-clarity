import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { SITE } from "@/lib/site-config";
import { Linkedin, Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Stress-free CQC compliance for UK dental practices. All your compliance, training and
            certificates under one roof.
          </p>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {SITE.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {SITE.phone}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {SITE.location}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/packages", "Packages"],
              ["/services", "Services"],
              ["/squat-practices", "Squat Practices"],
              ["/pricing", "Pricing"],
              ["/build-your-package", "Build Your Package"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-muted-foreground hover:text-foreground">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Company</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/about", "About"],
              ["/resources", "Resources"],
              ["/contact", "Contact"],
              ["/book", "Book Now"],
              ["/privacy", "Privacy Policy"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-muted-foreground hover:text-foreground">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-3">
            <a
              href={SITE.social.linkedin}
              aria-label="LinkedIn"
              className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={SITE.social.instagram}
              aria-label="Instagram"
              className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={SITE.social.facebook}
              aria-label="Facebook"
              className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {SITE.company.legalName}. All rights reserved.
          </p>
          <p>Company No. {SITE.company.companyNumber}</p>
        </div>
      </div>
    </footer>
  );
}
