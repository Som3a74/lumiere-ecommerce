"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Timepieces", href: "/collections" },
  { name: "Leather Goods", href: "/collections?category=leather-goods" },
  { name: "Heritage", href: "/collections?category=heritage" },
  { name: "Bespoke", href: "/collections?category=bespoke" },
];

import { logout } from "@/app/auth/actions";

export function Header({ user }: { user?: any }) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-primary/90 border-b border-surface-container backdrop-blur-md">
      <div className="relative flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-24 max-w-container-max mx-auto">
        {/* Left Navigation */}
        <div className="hidden md:flex items-center">
          <nav className="flex gap-4 lg:gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href.split('?')[0]));
              return (
                <Link
                  key={link.name}
                  className={cn(
                    "font-label-caps text-label-caps uppercase tracking-[0.2em] transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:bg-primary after:transition-transform after:duration-300 after:origin-left whitespace-nowrap text-[11px] lg:text-[12px] font-medium",
                    isActive
                      ? "text-primary after:scale-x-100"
                      : "text-secondary hover:text-primary after:scale-x-0 hover:after:scale-x-100"
                  )}
                  href={link.href}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link className="font-display-lg-mobile md:font-display-lg text-[28px] md:text-[36px] tracking-[0.15em] text-primary dark:text-surface-bright" href="/">
            LUMIÈRE
          </Link>
        </div>

        {/* Right Navigation */}
        <div className="flex justify-end items-center gap-4 lg:gap-6 ml-auto md:ml-0">
          <button aria-label="Search" className="text-primary hover:text-secondary transition-colors duration-300 flex items-center justify-center">
            <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>search</span>
          </button>
          <Link aria-label="Cart" href="/checkout" className={cn("transition-colors duration-300 flex items-center justify-center", pathname === "/checkout" ? "text-primary" : "text-primary hover:text-secondary")}>
            <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>shopping_bag</span>
          </Link>
          {user ? (
            <>
              <Link aria-label="Account" href="/my-account" className={cn("hidden md:flex transition-colors duration-300 items-center justify-center", pathname === "/my-account" ? "text-primary" : "text-primary hover:text-secondary")}>
                <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>person</span>
              </Link>
              <form action={logout} className="hidden md:flex items-center">
                <button aria-label="Sign Out" type="submit" className="text-primary hover:text-secondary transition-colors duration-300 flex items-center justify-center">
                  <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>logout</span>
                </button>
              </form>
            </>
          ) : (
            <Link aria-label="Sign In" href="/auth/login" className="hidden md:flex text-primary hover:text-secondary transition-colors duration-300 items-center justify-center">
              <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>login</span>
            </Link>
          )}
          <button aria-label="Menu" className="md:hidden text-primary hover:text-secondary transition-colors duration-300 flex items-center justify-center">
            <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
