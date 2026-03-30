import "server-only";

import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  stripeInstance ??= new Stripe(stripeSecretKey);

  return stripeInstance;
}
