"use client";

import type { Dispatch, SetStateAction } from "react";
import type { getProductBySlug } from "@/lib/products";

type ProductDetail = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;
type ProductSelection = {
  primaryColorId: string;
  secondaryColorId: string;
  trimColorId: string;
  size: string;
  customText: string;
};

type ProductCustomizerProps = {
  product: ProductDetail;
  selection: ProductSelection;
  onSelectionChange: Dispatch<SetStateAction<ProductSelection>>;
  onAddToCart: () => void;
};

export function ProductCustomizer({
  product,
  selection,
  onSelectionChange,
  onAddToCart,
}: ProductCustomizerProps) {
  const textCustomization = product.customizations.find(
    (customization) => customization.customizationType.code === "TEXT",
  );

  const getColorName = (colorId: string) =>
    product.colors.find((color) => color.id === colorId)?.name ?? "Not selected";

  const trimmedText = selection.customText.trim();
  const selectedSummary = {
    primaryColor: getColorName(selection.primaryColorId),
    secondaryColor: getColorName(selection.secondaryColorId),
    trimColor: getColorName(selection.trimColorId),
    size: product.sizes.find((size) => size.value === selection.size)?.label ?? "Not selected",
    customText: trimmedText.length > 0 ? trimmedText : "None",
  };

  const isReadyForCart =
    Boolean(selection.primaryColorId) &&
    Boolean(selection.secondaryColorId) &&
    Boolean(selection.trimColorId) &&
    Boolean(selection.size);

  return (
    <div className="mt-10 rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Customize Your Glove</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Primary Color"
          value={selection.primaryColorId}
          onChange={(value) =>
            onSelectionChange((current) => ({ ...current, primaryColorId: value }))
          }
          options={product.colors.map((color) => ({
            value: color.id,
            label: color.name,
          }))}
        />

        <SelectField
          label="Secondary Color"
          value={selection.secondaryColorId}
          onChange={(value) =>
            onSelectionChange((current) => ({ ...current, secondaryColorId: value }))
          }
          options={product.colors.map((color) => ({
            value: color.id,
            label: color.name,
          }))}
        />

        <SelectField
          label="Trim Color"
          value={selection.trimColorId}
          onChange={(value) =>
            onSelectionChange((current) => ({ ...current, trimColorId: value }))
          }
          options={product.colors.map((color) => ({
            value: color.id,
            label: color.name,
          }))}
        />

        <SelectField
          label="Size"
          value={selection.size}
          onChange={(value) => onSelectionChange((current) => ({ ...current, size: value }))}
          options={product.sizes.map((size) => ({
            value: size.value,
            label: size.label,
          }))}
        />
      </div>

      {textCustomization ? (
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {textCustomization.label}
          </label>
          <input
            type="text"
            value={selection.customText}
            maxLength={textCustomization.maxLength ?? undefined}
            placeholder={textCustomization.inputPlaceholder ?? "Add optional text"}
            onChange={(event) =>
              onSelectionChange((current) => ({ ...current, customText: event.target.value }))
            }
            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-brand-500"
          />
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl bg-stone-50 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Current Selection
        </p>
        <dl className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <SelectionItem label="Primary" value={selectedSummary.primaryColor} />
          <SelectionItem label="Secondary" value={selectedSummary.secondaryColor} />
          <SelectionItem label="Trim" value={selectedSummary.trimColor} />
          <SelectionItem label="Size" value={selectedSummary.size} />
          <SelectionItem label="Custom Text" value={selectedSummary.customText} />
        </dl>
      </div>

      <button
        type="button"
        disabled={!isReadyForCart}
        onClick={onAddToCart}
        className="mt-6 w-full rounded-full bg-brand-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Add to Cart
      </button>
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
};

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

type SelectionItemProps = {
  label: string;
  value: string;
};

function SelectionItem({ label, value }: SelectionItemProps) {
  return (
    <div>
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
