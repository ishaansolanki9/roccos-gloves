import { SuccessState } from "@/components/checkout/success-state";
import { getStripe } from "@/lib/stripe";

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  const isVerified = await verifyCheckoutSession(sessionId);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <SuccessState isVerified={isVerified} sessionId={isVerified ? sessionId : undefined} />
    </div>
  );
}

async function verifyCheckoutSession(sessionId?: string) {
  if (!sessionId) {
    return false;
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid";
  } catch {
    return false;
  }
}
