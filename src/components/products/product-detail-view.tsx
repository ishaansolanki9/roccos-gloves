"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { getProductBySlug } from "@/lib/products";
import { useCart } from "@/components/providers/cart-provider";
import { GlovePreview } from "@/components/products/glove-preview";
import { ProductCustomizer } from "@/components/products/product-customizer";
import type { CartItem } from "@/lib/cart";

type ProductDetail = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;

type ProductSelection = {
  primaryColorId: string;
  secondaryColorId: string;
  trimColorId: string;
  size: string;
  customText: string;
};

type ProductDetailViewProps = {
  product: ProductDetail;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const defaultSize = product.sizes[0]?.value ?? "";
  const defaultColor = product.colors[0]?.id ?? "";

  const [selection, setSelection] = useState<ProductSelection>({
    primaryColorId: defaultColor,
    secondaryColorId: defaultColor,
    trimColorId: defaultColor,
    size: defaultSize,
    customText: "",
  });

  const primaryColor = product.colors.find((color) => color.id === selection.primaryColorId) ?? null;
  const secondaryColor =
    product.colors.find((color) => color.id === selection.secondaryColorId) ?? null;
  const trimColor = product.colors.find((color) => color.id === selection.trimColorId) ?? null;

  function handleAddToCart() {
    const size = product.sizes.find((item) => item.value === selection.size);

    if (!primaryColor || !secondaryColor || !trimColor || !size) {
      return;
    }

    const cartItem: CartItem = {
      id: createCartItemId(),
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.imageUrl ?? null,
      unitPrice: product.price,
      quantity: 1,
      customization: {
        primaryColor: {
          id: primaryColor.id,
          name: primaryColor.name,
          hexCode: primaryColor.hexCode,
        },
        secondaryColor: {
          id: secondaryColor.id,
          name: secondaryColor.name,
          hexCode: secondaryColor.hexCode,
        },
        trimColor: {
          id: trimColor.id,
          name: trimColor.name,
          hexCode: trimColor.hexCode,
        },
        size: {
          value: size.value,
          label: size.label,
        },
        customText: selection.customText.trim(),
      },
    };

    addItem(cartItem);
    router.push("/cart");
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
      <GlovePreview
        productName={product.name}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        trimColor={trimColor}
        customText={selection.customText}
      />

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Custom Glove</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          {product.name}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          {product.description ??
            "Configure colors, size, and optional text before adding this glove to your cart."}
        </p>
        <p className="mt-8 text-3xl font-semibold text-brand-800">${product.price.toFixed(2)}</p>

        <ProductCustomizer
          product={product}
          selection={selection}
          onSelectionChange={setSelection}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}

function createCartItemId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `cart_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
