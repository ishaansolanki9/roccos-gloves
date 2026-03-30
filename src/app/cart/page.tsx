import { CartView } from "@/components/cart/cart-view";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Cart</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Review custom glove selections before checkout.
        </h1>
      </div>

      <CartView />
    </div>
  );
}
