import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          Checkout Canceled
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Your cart is still waiting for you.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          You left Stripe Checkout before completing payment. Your customized glove selections are
          still saved in the cart.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/cart"
            className="rounded-full bg-brand-800 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Return to Cart
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700"
          >
            Keep Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
