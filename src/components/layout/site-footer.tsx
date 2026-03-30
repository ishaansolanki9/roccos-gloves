import Link from "next/link";

const footerLinks = [
  { href: "/products", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/admin", label: "Admin" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-base font-semibold tracking-tight text-slate-900">Rocco Gloves</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            A modern storefront for premium customizable gloves, built with Next.js, Prisma, and
            Stripe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 transition hover:bg-stone-100 hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
