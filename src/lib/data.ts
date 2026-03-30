export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "1",
    name: "3-finger glove",
    slug: "rocco-pro-catcher",
    price: 15,
    category: "Baseball",
    description: "Premium catcher glove with deep pocket and custom embroidery options.",
  },
  {
    id: "2",
    name: "4-finger glove",
    slug: "rocco-field-elite",
    price: 18,
    category: "Baseball",
    description: "Balanced infield glove designed for fast transfers and all-day comfort.",
  },
  {
    id: "3",
    name: "Rocco Utility Trainer",
    slug: "rocco-utility-trainer",
    price: 219,
    category: "Training",
    description: "Versatile training glove built for repeat reps and durable performance.",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
