import { PageLoading } from "@/components/ui/page-loading";

export default function Loading() {
  return (
    <PageLoading
      title="Loading Storefront"
      description="Fetching products, customization options, and your latest view."
      cards={3}
    />
  );
}
