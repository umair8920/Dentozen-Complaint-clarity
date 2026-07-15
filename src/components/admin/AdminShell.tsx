import type { LucideIcon } from "lucide-react";
import { Bell, LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/api/auth.functions";

type AdminUser = {
  name: string;
  email: string;
};

export type AdminNavItem<T extends string> = {
  id: T;
  label: string;
  icon: LucideIcon;
};

export function AdminShell<T extends string>({
  admin,
  activeTab,
  title,
  sectionLabel = "Admin",
  navItems,
  onTabChange,
  children,
}: {
  admin: AdminUser;
  activeTab: T;
  title: string;
  sectionLabel?: string;
  navItems: AdminNavItem<T>[];
  onTabChange: (tab: T) => void;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    toast.success("Logged out.");
    await navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border bg-background lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center border-b border-border px-5">
            <Logo />
          </div>
          <nav className="flex-1 space-y-2 px-4 py-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={[
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition",
                  activeTab === item.id
                    ? "gradient-purple-orange text-white shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
                onClick={() => onTabChange(item.id)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-lg">
          <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {sectionLabel}
              </div>
              <h1 className="text-lg font-extrabold">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Alerts">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border bg-background p-1 pr-3 transition hover:bg-muted">
                    <span className="grid h-9 w-9 place-items-center rounded-full gradient-teal-purple text-sm font-bold text-white">
                      {admin.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="hidden text-sm font-semibold sm:inline">Profile</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>
                    <div>{admin.name}</div>
                    <div className="mt-1 truncate text-xs font-normal text-muted-foreground">
                      {admin.email}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                  activeTab === item.id
                    ? "gradient-purple-orange text-white"
                    : "border border-border bg-background text-muted-foreground",
                ].join(" ")}
                onClick={() => onTabChange(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
