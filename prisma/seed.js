const { PrismaClient } = require("@prisma/client");
const { randomBytes, scryptSync } = require("node:crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

async function upsertColor({ name, slug, hexCode, sortOrder }) {
  return prisma.color.upsert({
    where: { slug },
    update: {
      name,
      hexCode,
      isAvailable: true,
      sortOrder,
    },
    create: {
      name,
      slug,
      hexCode,
      isAvailable: true,
      sortOrder,
    },
  });
}

async function seedProduct({
  name,
  slug,
  description,
  basePrice,
  colorIds,
  sizes,
  textCustomizationId,
}) {
  const product = await prisma.product.upsert({
    where: { slug },
    update: {
      name,
      description,
      imageUrl: null,
      basePrice,
      status: "ACTIVE",
      isCustomizable: true,
    },
    create: {
      name,
      slug,
      description,
      imageUrl: null,
      basePrice,
      status: "ACTIVE",
      isCustomizable: true,
    },
  });

  await prisma.productColor.deleteMany({
    where: {
      productId: product.id,
    },
  });

  await prisma.productSize.deleteMany({
    where: {
      productId: product.id,
    },
  });

  await prisma.productCustomization.deleteMany({
    where: {
      productId: product.id,
    },
  });

  await prisma.productColor.createMany({
    data: colorIds.map((colorId) => ({
      productId: product.id,
      colorId,
    })),
  });

  await prisma.productSize.createMany({
    data: sizes.map((size, index) => ({
      productId: product.id,
      label: size.label,
      value: size.value,
      sortOrder: index,
    })),
  });

  await prisma.productCustomization.create({
    data: {
      productId: product.id,
      customizationTypeId: textCustomizationId,
      label: "Custom text",
      inputPlaceholder: "Optional name or number",
      maxLength: 12,
      isRequired: false,
      isActive: true,
    },
  });

  return product;
}

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@roccogloves.com";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Rocco Admin",
      passwordHash: hashPassword(password),
      role: "SUPER_ADMIN",
    },
  });

  const [black, bone, camel] = await Promise.all([
    upsertColor({
      name: "Black",
      slug: "black",
      hexCode: "#1f2937",
      sortOrder: 0,
    }),
    upsertColor({
      name: "Bone",
      slug: "bone",
      hexCode: "#f5f1e8",
      sortOrder: 1,
    }),
    upsertColor({
      name: "Camel",
      slug: "camel",
      hexCode: "#c68a3a",
      sortOrder: 2,
    }),
  ]);

  const textCustomizationType = await prisma.customizationType.upsert({
    where: {
      code: "TEXT",
    },
    update: {
      name: "Text",
      description: "Optional stitched custom text.",
      isActive: true,
    },
    create: {
      name: "Text",
      code: "TEXT",
      description: "Optional stitched custom text.",
      isActive: true,
    },
  });

  const defaultSizes = [
    { label: "Youth", value: "youth" },
    { label: "Adult", value: "adult" },
  ];

  await seedProduct({
    name: "3-finger glove",
    slug: "3-finger-glove",
    description:
      "A simple placeholder 3-finger glove product for testing add-to-cart and checkout.",
    basePrice: 15,
    colorIds: [black.id, bone.id, camel.id],
    sizes: defaultSizes,
    textCustomizationId: textCustomizationType.id,
  });

  await seedProduct({
    name: "4-finger glove",
    slug: "4-finger-glove",
    description:
      "A simple placeholder 4-finger glove product for testing add-to-cart and checkout.",
    basePrice: 18,
    colorIds: [black.id, bone.id, camel.id],
    sizes: defaultSizes,
    textCustomizationId: textCustomizationType.id,
  });

  console.log(`Seeded admin user: ${email}`);
  console.log("Seeded placeholder products: 3-finger glove, 4-finger glove");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
