"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/components/providers/cart-provider";

type SuccessStateProps = {
  sessionId?: string;
  isVerified: boolean;
};

export function SuccessState({ sessionId, isVerified }: SuccessStateProps) {
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    if (!isVerified || !sessionId || hasCleared.current) {
      return;
    }

    hasCleared.current = true;
    clearCart();
  }, [clearCart, sessionId]);

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        {isVerified ? "Payment Complete" : "Verification Required"}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
        {isVerified ? "Your order is confirmed." : "We could not verify this checkout session."}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
        {isVerified
          ? "Stripe completed the checkout flow successfully. Your cart has been cleared locally and you can continue browsing custom gloves."
          : "Your cart has been left intact. Return to checkout from the cart or confirm that the Stripe session is valid before continuing."}
      </p>
      {sessionId ? (
        <p className="mt-4 text-sm text-slate-500">Checkout session: {sessionId}</p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/products"
          className="rounded-full bg-brand-800 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Continue Shopping
        </Link>
        <Link
          href="/cart"
          className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}
