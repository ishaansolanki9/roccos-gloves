import "server-only";

import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function fulfillCheckoutSession(sessionId: string) {
  const stripe = getStripe();

  const existingOrder = await prisma.order.findUnique({
    where: {
      stripeCheckoutId: sessionId,
    },
    select: {
      id: true,
    },
  });

  if (existingOrder) {
    return existingOrder;
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product"],
  });

  if (session.payment_status !== "paid") {
    return null;
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    expand: ["data.price.product"],
  });

  const customerDetails = session.customer_details;
  const shippingDetails = session.collected_information?.shipping_details;

  if (!customerDetails?.email || !shippingDetails?.address) {
    throw new Error("Checkout session is missing customer or shipping details.");
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: createOrderNumber(),
      email: customerDetails.email,
      customerFirstName: getFirstName(customerDetails.name),
      customerLastName: getLastName(customerDetails.name),
      shippingAddressLine1: shippingDetails.address.line1 ?? "",
      shippingAddressLine2: shippingDetails.address.line2 ?? null,
      shippingCity: shippingDetails.address.city ?? "",
      shippingState: shippingDetails.address.state ?? "",
      shippingPostalCode: shippingDetails.address.postal_code ?? "",
      shippingCountry: shippingDetails.address.country ?? "",
      subtotalAmount: centsToDollars(session.amount_subtotal ?? 0),
      shippingAmount: centsToDollars(session.total_details?.amount_shipping ?? 0),
      taxAmount: centsToDollars(session.total_details?.amount_tax ?? 0),
      totalAmount: centsToDollars(session.amount_total ?? 0),
      status: "PAID",
      stripeCheckoutId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      notes: `Stripe payment status: ${session.payment_status}`,
      items: {
        create: lineItems.data.map((lineItem) => {
          const productDetails = getLineItemProductDetails(lineItem);

          return {
            productId: productDetails.productId || null,
            productName: lineItem.description ?? "Custom glove",
            productSlug: productDetails.slug,
            unitPrice: centsToDollars(
              lineItem.amount_subtotal / Math.max(lineItem.quantity ?? 1, 1),
            ),
            quantity: lineItem.quantity ?? 1,
            sizeLabel: productDetails.size,
            colorName: productDetails.primaryColor,
            colorHexCode: productDetails.primaryHexCode,
            customText: productDetails.customText === "None" ? null : productDetails.customText,
            customizationsJson: {
              primaryColor: {
                name: productDetails.primaryColor,
                hexCode: productDetails.primaryHexCode,
              },
              secondaryColor: {
                name: productDetails.secondaryColor,
                hexCode: productDetails.secondaryHexCode,
              },
              trimColor: {
                name: productDetails.trimColor,
                hexCode: productDetails.trimHexCode,
              },
              size: productDetails.size,
              customText: productDetails.customText === "None" ? "" : productDetails.customText,
            },
            lineTotal: centsToDollars(lineItem.amount_total),
          };
        }),
      },
    },
  });

  return order;
}

export async function markCheckoutSessionFailed(sessionId: string) {
  return prisma.order.updateMany({
    where: {
      stripeCheckoutId: sessionId,
    },
    data: {
      status: "CANCELED",
      notes: "Stripe async payment failed.",
    },
  });
}

function getLineItemProductDetails(lineItem: Stripe.LineItem) {
  const product = lineItem.price?.product;

  if (!product || typeof product === "string" || "deleted" in product) {
    throw new Error("Stripe line item product metadata is missing.");
  }

  return {
    productId: product.metadata.productId,
    slug: product.metadata.slug,
    primaryColor: product.metadata.primaryColor,
    primaryHexCode: product.metadata.primaryHexCode,
    secondaryColor: product.metadata.secondaryColor,
    secondaryHexCode: product.metadata.secondaryHexCode,
    trimColor: product.metadata.trimColor,
    trimHexCode: product.metadata.trimHexCode,
    size: product.metadata.size,
    customText: product.metadata.customText || "None",
  };
}

function centsToDollars(amount: number) {
  return amount / 100;
}

function createOrderNumber() {
  return `RG-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;
}

function getFirstName(name: string | null | undefined) {
  if (!name) {
    return "Customer";
  }

  return name.trim().split(/\s+/)[0] ?? "Customer";
}

function getLastName(name: string | null | undefined) {
  if (!name) {
    return "Customer";
  }

  const parts = name.trim().split(/\s+/);

  if (parts.length < 2) {
    return parts[0] ?? "Customer";
  }

  return parts.slice(1).join(" ");
}
