"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MyAccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Order History", href: "/my-account", icon: "chevron_right" },
    { name: "Profile", href: "/my-account/profile", icon: "chevron_right" },
    { name: "Wishlist", href: "/my-account/wishlist", icon: "chevron_right" },
  ];

  return (
    <div className="pt-12 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
      <div className="mb-16 text-center md:text-left">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">
          Account Dashboard
        </h1>
        <p className="font-body-lg text-body-lg text-secondary">Welcome back, Mr. Sterling.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Sidebar Navigation */}
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
            <button className="flex items-center space-x-2 mt-8 text-secondary hover:text-primary transition-colors font-label-caps text-label-caps tracking-widest uppercase px-4">
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="col-span-1 md:col-span-9 space-y-24">
          {children}
        </div>
      </div>
    </div>
  );
}
