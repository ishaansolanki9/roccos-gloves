import Image from "next/image";
import Link from "next/link";
type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  imageUrl?: string | null;
  price: number;
};

type ProductCardProps = {
  product: ProductCardData;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-100 via-stone-100 to-brand-50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium uppercase tracking-[0.2em] text-brand-700">
            Product Image
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold tracking-tight text-slate-900">{product.name}</h3>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-semibold text-brand-800">${product.price.toFixed(2)}</span>
          <span className="text-sm font-medium text-slate-500">Customizable</span>
        </div>
        <div className="mt-6">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex rounded-full bg-brand-800 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            View Product
          </Link>
        </div>
      </div>
    </article>
  );
}
