"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/auth/actions";

export function MyAccountSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Order History", href: "/my-account", icon: "chevron_right" },
    { name: "Profile", href: "/my-account/profile", icon: "chevron_right" },
    { name: "Wishlist", href: "/my-account/wishlist", icon: "chevron_right" },
  ];

  return (
    <aside className="col-span-1 md:col-span-3 mb-12 md:mb-0">
      <nav className="flex flex-col space-y-2 md:sticky md:top-32">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 transition-colors font-label-caps text-label-caps tracking-widest uppercase border border-transparent ${
                isActive
                  ? "bg-primary text-on-primary"
                  : "text-secondary hover:bg-surface-container-low hover:border-surface-container"
              }`}
            >
              <span>{item.name}</span>
              {isActive && <span className="material-symbols-outlined text-sm">{item.icon}</span>}
            </Link>
          );
        })}
        <form action={logout}>
          <button type="submit" className="flex items-center space-x-2 mt-8 text-secondary hover:text-primary transition-colors font-label-caps text-label-caps tracking-widest uppercase px-4">
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </form>
      </nav>
    </aside>
  );
}
