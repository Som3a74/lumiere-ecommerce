"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SearchModal } from "@/components/shared/SearchModal";
import { logout } from "@/app/(storefront)/auth/actions";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { name: "Collection", href: "/collections" },
  { name: "Wishlist", href: "/my-account/wishlist" },
  { name: "About Us", href: "/about" },
];

export function Header({ user, isAdmin }: { user?: any, isAdmin?: boolean }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when pathname changes
  useEffect(() => {
    const timer = setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-primary/90 border-b border-surface-container backdrop-blur-md">
        <div className="grid grid-cols-3 items-center w-full px-margin-mobile md:px-margin-desktop h-24 max-w-container-max mx-auto">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center justify-start overflow-hidden">
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

          {/* Mobile Empty Left (to balance grid) */}
          <div className="lg:hidden flex items-center justify-start"></div>

          {/* Center Logo */}
          <div className="flex justify-center items-center">
            <Link className="font-display-lg-mobile md:font-display-lg text-[28px] md:text-[36px] tracking-[0.15em] text-primary dark:text-surface-bright whitespace-nowrap" href="/">
              LUMIÈRE
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="flex justify-end items-center gap-4 lg:gap-6 z-10">
            <SearchModal />
            <Link aria-label="Cart" href="/cart" className={cn("transition-colors duration-300 flex items-center justify-center", pathname === "/cart" ? "text-primary" : "text-primary hover:text-secondary")}>
              <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>shopping_bag</span>
            </Link>
            {user ? (
              <>
                {isAdmin && (
                  <Link aria-label="Dashboard" href="/admin" className={cn("hidden lg:flex transition-colors duration-300 items-center justify-center", pathname.startsWith("/admin") ? "text-primary" : "text-primary hover:text-secondary")}>
                    <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>dashboard</span>
                  </Link>
                )}
                <Link aria-label="Account" href="/my-account" className={cn("hidden lg:flex transition-colors duration-300 items-center justify-center", pathname === "/my-account" ? "text-primary" : "text-primary hover:text-secondary")}>
                  <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>person</span>
                </Link>
                <form action={logout} className="hidden lg:flex items-center">
                  <Button variant="ghost" size="icon" aria-label="Sign Out" type="submit" className="text-primary hover:text-secondary transition-colors duration-300 rounded-full">
                    <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>logout</span>
                  </Button>
                </form>
              </>
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <Link href="/auth/login" className="font-label-caps text-label-caps uppercase tracking-[0.2em] transition-colors duration-300 text-[11px] lg:text-[12px] font-medium text-secondary hover:text-primary">
                  Login
                </Link>
                <Link href="/auth/register" className="font-label-caps text-label-caps uppercase tracking-[0.2em] transition-colors duration-300 text-[11px] lg:text-[12px] font-medium text-secondary hover:text-primary border border-secondary hover:border-primary px-3 py-1.5 rounded-sm">
                  Sign Up
                </Link>
              </div>
            )}
            <button
              aria-label="Menu"
              className="lg:hidden text-primary hover:text-secondary transition-colors duration-300 flex items-center justify-center z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-white/95 dark:bg-primary/95 backdrop-blur-xl z-40 lg:hidden flex flex-col justify-center items-center transition-all duration-500 ease-in-out",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
        )}
      >
        <nav className="flex flex-col items-center gap-8 text-center mt-12">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-display-lg-mobile text-[32px] text-primary hover:text-secondary transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}

          <div className="w-12 h-[1px] bg-surface-container my-4"></div>

          {user ? (
            <div className="flex flex-col gap-6 items-center">
              {isAdmin && (
                <Link href="/admin" className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-primary hover:text-secondary transition-colors">
                  Dashboard
                </Link>
              )}
              <Link href="/my-account" className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-primary hover:text-secondary transition-colors">
                My Account
              </Link>
              <form action={logout}>
                <Button variant="link" type="submit" className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors hover:no-underline">
                  Sign Out
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-6 items-center">
              <Link href="/auth/login" className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-primary hover:text-secondary transition-colors">
                Login
              </Link>
              <Link href="/auth/register" className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-primary hover:text-secondary transition-colors border-b border-primary pb-1">
                Create Account
              </Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
