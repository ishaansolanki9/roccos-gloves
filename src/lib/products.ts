import { prisma } from "@/lib/prisma";

export async function getProducts() {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      name: true,
      imageUrl: true,
      basePrice: true,
    },
  });

  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    price: Number(product.basePrice),
  }));
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      imageUrl: true,
      description: true,
      basePrice: true,
      isCustomizable: true,
      colorOptions: {
        where: {
          color: {
            isAvailable: true,
          },
        },
        orderBy: {
          color: {
            sortOrder: "asc",
          },
        },
        select: {
          color: {
            select: {
              id: true,
              name: true,
              hexCode: true,
              slug: true,
            },
          },
        },
      },
      sizeOptions: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          label: true,
          value: true,
        },
      },
      customizations: {
        where: {
          isActive: true,
        },
        select: {
          id: true,
          label: true,
          inputPlaceholder: true,
          maxLength: true,
          isRequired: true,
          customizationType: {
            select: {
              code: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    description: product.description,
    price: Number(product.basePrice),
    isCustomizable: product.isCustomizable,
    colors: product.colorOptions.map((entry) => entry.color),
    sizes: product.sizeOptions,
    customizations: product.customizations,
  };
}
