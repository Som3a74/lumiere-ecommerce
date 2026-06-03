"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Tags,
  TicketPercent,
  Settings,
  LogOut,
  Palette,
  Ruler,
  Users,
  ShoppingCart,
  Star
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Coupons", href: "/admin/coupons", icon: TicketPercent },
  { name: "Colors", href: "/admin/colors", icon: Palette },
  { name: "Sizes", href: "/admin/sizes", icon: Ruler },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen w-64 flex-col bg-surface border-r border-outline-variant/30">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-outline-variant/30 bg-surface-bright">
        <Link href="/" className="font-heading text-xl uppercase tracking-widest text-primary">
          Lumière Admin
        </Link>
      </div>
      <nav className="flex flex-1 flex-col p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-none",
                isActive
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 flex-shrink-0 h-5 w-5",
                  isActive ? "text-on-primary" : "text-on-surface-variant group-hover:text-primary"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-outline-variant/30">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center px-3 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-on-surface-variant group-hover:text-primary" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
}
