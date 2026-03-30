"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, requireAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function redirectAdminError(message: string): never {
  redirect(`/admin?error=${encodeURIComponent(message)}`);
}

export async function addColor(formData: FormData) {
  await requireAdminUser();

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const hexCode = String(formData.get("hexCode") ?? "").trim();
  const isAvailable = formData.get("isAvailable") === "on";

  if (!name || !slug || !hexCode) {
    redirectAdminError("Name, slug, and hex code are required.");
  }

  const existingColor = await prisma.color.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  if (existingColor) {
    redirectAdminError("A color with that slug already exists.");
  }

  try {
    await prisma.color.create({
      data: {
        name,
        slug,
        hexCode,
        isAvailable,
      },
    });
  } catch {
    redirectAdminError("Unable to add that color right now.");
  }

  revalidatePath("/admin");
}

export async function updateColor(formData: FormData) {
  await requireAdminUser();

  const colorId = String(formData.get("colorId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const hexCode = String(formData.get("hexCode") ?? "").trim();
  const isAvailable = formData.get("isAvailable") === "on";

  if (!colorId || !name || !slug || !hexCode) {
    redirectAdminError("Missing color data.");
  }

  const existingColor = await prisma.color.findFirst({
    where: {
      slug,
      NOT: {
        id: colorId,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingColor) {
    redirectAdminError("A color with that slug already exists.");
  }

  try {
    await prisma.color.update({
      where: {
        id: colorId,
      },
      data: {
        name,
        slug,
        hexCode,
        isAvailable,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      redirectAdminError("That color no longer exists.");
    }

    redirectAdminError("Unable to update that color right now.");
  }

  revalidatePath("/admin");
}

export async function deleteColor(formData: FormData) {
  await requireAdminUser();

  const colorId = String(formData.get("colorId") ?? "");

  if (!colorId) {
    redirectAdminError("Color ID is required.");
  }

  try {
    await prisma.$transaction([
      prisma.productColor.deleteMany({
        where: {
          colorId,
        },
      }),
      prisma.color.delete({
        where: {
          id: colorId,
        },
      }),
    ]);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      redirectAdminError("That color no longer exists.");
    }

    redirectAdminError("Unable to delete that color right now.");
  }

  revalidatePath("/admin");
}

export async function toggleColorAvailability(formData: FormData) {
  await requireAdminUser();

  const colorId = String(formData.get("colorId") ?? "");
  const isAvailable = String(formData.get("isAvailable") ?? "") === "true";

  if (!colorId) {
    redirectAdminError("Color ID is required.");
  }

  try {
    await prisma.color.update({
      where: {
        id: colorId,
      },
      data: {
        isAvailable: !isAvailable,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      redirectAdminError("That color no longer exists.");
    }

    redirectAdminError("Unable to update color availability right now.");
  }

  revalidatePath("/admin");
}

export async function updateProductPrice(formData: FormData) {
  await requireAdminUser();

  const productId = String(formData.get("productId") ?? "");
  const rawPrice = String(formData.get("basePrice") ?? "");
  const basePrice = Number(rawPrice);

  if (!productId || Number.isNaN(basePrice) || basePrice < 0) {
    redirectAdminError("Valid product price is required.");
  }

  try {
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        basePrice,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      redirectAdminError("That product no longer exists.");
    }

    redirectAdminError("Unable to update that product price right now.");
  }

  revalidatePath("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/login");
}
