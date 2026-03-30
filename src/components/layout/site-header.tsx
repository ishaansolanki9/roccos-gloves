"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/providers/cart-provider";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, isHydrated } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight text-brand-800">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-800 text-sm font-bold text-white shadow-sm">
            RG
          </span>
          <span>Rocco Gloves</span>
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-6">
          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 transition ${
                    isActive
                      ? "bg-brand-800 text-white shadow-sm"
                      : "hover:bg-stone-100 hover:text-brand-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/cart"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
          >
            <span>Cart</span>
            <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-stone-100 px-2 py-1 text-xs font-bold text-slate-700">
              {isHydrated ? itemCount : 0}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
