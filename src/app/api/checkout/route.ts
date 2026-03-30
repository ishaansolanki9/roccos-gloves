import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import type { CartItem } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

type CheckoutRequestBody = {
  items: CartItem[];
};

type CheckoutLineItemDetails = {
  productId: string;
  slug: string;
  name: string;
  unitAmount: number;
  quantity: number;
  primaryColor: {
    name: string;
    hexCode: string;
  };
  secondaryColor: {
    name: string;
    hexCode: string;
  };
  trimColor: {
    name: string;
    hexCode: string;
  };
  sizeLabel: string;
  customText: string;
};

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const body = (await request.json()) as CheckoutRequestBody;
    const items = Array.isArray(body.items) ? body.items : [];

    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const invalidItem = items.find(
      (item) =>
        !item.id ||
        !item.name ||
        !item.productId ||
        typeof item.unitPrice !== "number" ||
        item.unitPrice < 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        !item.customization?.primaryColor?.name ||
        !item.customization?.secondaryColor?.name ||
        !item.customization?.trimColor?.name ||
        !item.customization?.size?.label,
    );

    if (invalidItem) {
      return NextResponse.json({ error: "Cart contains invalid items." }, { status: 400 });
    }

    const origin = request.headers.get("origin") ?? new URL(request.url).origin;

    const validatedItems = await Promise.all(items.map((item) => validateCartItem(item)));

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = validatedItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.unitAmount,
        product_data: {
          name: item.name,
          description: buildCustomizationDescription(item),
          metadata: {
            productId: item.productId,
            slug: item.slug,
            primaryColor: item.primaryColor.name,
            primaryHexCode: item.primaryColor.hexCode,
            secondaryColor: item.secondaryColor.name,
            secondaryHexCode: item.secondaryColor.hexCode,
            trimColor: item.trimColor.name,
            trimHexCode: item.trimColor.hexCode,
            size: item.sizeLabel,
            customText: item.customText || "None",
          },
        },
      },
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      client_reference_id: items.map((item) => item.id).join(",").slice(0, 200),
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      metadata: {
        cartItemCount: String(items.length),
        source: "rocco-glove-store",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json({ error: "Unable to start checkout." }, { status: 500 });
  }
}

async function validateCartItem(item: CartItem): Promise<CheckoutLineItemDetails> {
  const product = await prisma.product.findUnique({
    where: {
      id: item.productId,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      basePrice: true,
      status: true,
      colorOptions: {
        where: {
          color: {
            isAvailable: true,
          },
        },
        select: {
          color: {
            select: {
              id: true,
              name: true,
              hexCode: true,
            },
          },
        },
      },
      sizeOptions: {
        select: {
          value: true,
          label: true,
        },
      },
      customizations: {
        where: {
          isActive: true,
          customizationType: {
            code: "TEXT",
          },
        },
        select: {
          maxLength: true,
        },
      },
    },
  });

  if (!product || product.status !== "ACTIVE" || product.slug !== item.slug) {
    throw new Error("Cart contains unavailable products.");
  }

  const availableColors = product.colorOptions.map((entry) => entry.color);
  const primaryColor = availableColors.find((color) => color.id === item.customization.primaryColor.id);
  const secondaryColor = availableColors.find(
    (color) => color.id === item.customization.secondaryColor.id,
  );
  const trimColor = availableColors.find((color) => color.id === item.customization.trimColor.id);
  const size = product.sizeOptions.find((option) => option.value === item.customization.size.value);

  if (!primaryColor || !secondaryColor || !trimColor || !size) {
    throw new Error("Cart contains invalid customization selections.");
  }

  const customText = item.customization.customText.trim();
  const textCustomization = product.customizations[0] ?? null;

  if (customText && !textCustomization) {
    throw new Error("This product does not support custom text.");
  }

  if (textCustomization?.maxLength && customText.length > textCustomization.maxLength) {
    throw new Error("Custom text exceeds the allowed length.");
  }

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    unitAmount: Math.round(Number(product.basePrice) * 100),
    quantity: item.quantity,
    primaryColor: {
      name: primaryColor.name,
      hexCode: primaryColor.hexCode,
    },
    secondaryColor: {
      name: secondaryColor.name,
      hexCode: secondaryColor.hexCode,
    },
    trimColor: {
      name: trimColor.name,
      hexCode: trimColor.hexCode,
    },
    sizeLabel: size.label,
    customText,
  };
}

function buildCustomizationDescription(item: CheckoutLineItemDetails) {
  const parts = [
    `Primary: ${item.primaryColor.name}`,
    `Secondary: ${item.secondaryColor.name}`,
    `Trim: ${item.trimColor.name}`,
    `Size: ${item.sizeLabel}`,
  ];

  if (item.customText) {
    parts.push(`Text: ${item.customText}`);
  }

  return parts.join(" | ");
}
