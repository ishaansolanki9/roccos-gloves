import { PageLoading } from "@/components/ui/page-loading";

export default function ProductsLoading() {
  return (
    <PageLoading
      title="Loading Products"
      description="Gathering the latest glove catalog from the database."
      cards={6}
    />
  );
}
