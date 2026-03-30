import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 2);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <section className="max-w-3xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            Custom Performance Gloves
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950">
            Build gloves that look personal and play like pro gear.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Start with premium glove models, then layer in color, size, and custom text options
            through a modern storefront built to scale.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-full bg-brand-800 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Shop Gloves
            </Link>
            <Link
              href="/admin"
              className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
              Featured
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Starter product grid
            </h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-brand-700 hover:text-brand-600">
            Browse all products
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-white px-8 py-14 text-center">
            <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
              No featured products yet
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Add active products to PostgreSQL and they will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
