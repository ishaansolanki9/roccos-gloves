"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/providers/cart-provider";

export function CartView() {
  const { items, subtotal, removeItem, clearCart, isHydrated } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  async function handleCheckout() {
    try {
      setIsCheckingOut(true);
      setCheckoutError("");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.href = data.url;
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Something went wrong starting checkout.",
      );
      setIsCheckingOut(false);
    }
  }

  if (!isHydrated) {
    return (
      <div className="mt-12 rounded-[1.75rem] border border-stone-200 bg-white px-8 py-16 text-center">
        <p className="text-sm font-medium text-slate-500">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-12 rounded-[1.75rem] border border-dashed border-stone-300 bg-white px-8 py-16 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Your cart is empty</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Start customizing a glove and it will appear here with all of its selected colors and text.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-brand-800 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-5 rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm sm:flex-row"
          >
            <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-stone-100 sm:w-36">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Glove
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                    {item.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">Qty {item.quantity}</p>
                </div>
                <p className="text-lg font-semibold text-brand-800">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </p>
              </div>

              <dl className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                <CartDetail label="Primary Color" value={item.customization.primaryColor.name} />
                <CartDetail
                  label="Secondary Color"
                  value={item.customization.secondaryColor.name}
                />
                <CartDetail label="Trim Color" value={item.customization.trimColor.name} />
                <CartDetail label="Size" value={item.customization.size.label} />
                <CartDetail
                  label="Custom Text"
                  value={item.customization.customText || "None"}
                />
              </dl>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="mt-5 text-sm font-semibold text-red-600 hover:text-red-500"
              >
                Remove item
              </button>
            </div>
          </article>
        ))}
      </section>

      <aside className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <span>Items</span>
          <span>{items.length}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="mt-6 border-t border-stone-200 pt-6">
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full rounded-full bg-brand-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isCheckingOut ? "Redirecting to Stripe..." : "Proceed to Checkout"}
          </button>
          {checkoutError ? (
            <p className="mt-3 text-sm font-medium text-red-600">{checkoutError}</p>
          ) : null}
          <Link
            href="/products"
            className="mt-4 block text-center text-sm font-semibold text-brand-700"
          >
            Continue shopping
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="mt-4 block w-full text-center text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            Clear cart
          </button>
        </div>
      </aside>
    </div>
  );
}

function CartDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
