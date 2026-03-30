"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createAdminSession, verifyPassword } from "@/lib/admin-auth";

export async function loginAdmin(_: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const adminUser = await prisma.adminUser.findUnique({
    where: {
      email,
    },
  });

  if (!adminUser || !adminUser.isActive || !verifyPassword(password, adminUser.passwordHash)) {
    return { error: "Invalid admin credentials." };
  }

  await prisma.adminUser.update({
    where: {
      id: adminUser.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });

  await createAdminSession(adminUser.id);
  redirect("/admin");
}
