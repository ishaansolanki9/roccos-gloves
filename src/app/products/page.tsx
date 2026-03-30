import { ProductCard } from "@/components/products/product-card";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Products</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Explore glove models ready for customization.
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Browse live product data from PostgreSQL, rendered with Prisma in a server component for
          fast and reliable storefront performance.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="mt-12 rounded-[1.75rem] border border-dashed border-stone-300 bg-white px-8 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">No products yet</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Add active products in PostgreSQL and they will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
