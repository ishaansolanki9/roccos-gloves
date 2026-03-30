export const CART_STORAGE_KEY = "rocco-cart";

export type CartItemCustomization = {
  primaryColor: {
    id: string;
    name: string;
    hexCode: string;
  };
  secondaryColor: {
    id: string;
    name: string;
    hexCode: string;
  };
  trimColor: {
    id: string;
    name: string;
    hexCode: string;
  };
  size: {
    value: string;
    label: string;
  };
  customText: string;
};

export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  customization: CartItemCustomization;
};

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}
