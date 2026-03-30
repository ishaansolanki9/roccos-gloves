import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const adminUser = await requireAdminUser();
  const { error } = await searchParams;

  const [colors, products] = await Promise.all([
    prisma.color.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { name: "asc" },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        hexCode: true,
        isAvailable: true,
      },
    }),
    prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        status: true,
      },
    }),
  ]);

  return (
    <AdminDashboard
      adminUser={adminUser}
      colors={colors}
      errorMessage={error}
      products={products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        basePrice: product.basePrice.toString(),
        status: product.status,
      }))}
    />
  );
}
