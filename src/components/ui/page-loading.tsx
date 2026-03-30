type PageLoadingProps = {
  title?: string;
  description?: string;
  cards?: number;
};

export function PageLoading({
  title = "Loading",
  description = "Preparing the next view for you.",
  cards = 3,
}: PageLoadingProps) {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-6 py-16 sm:py-20">
      <div className="max-w-3xl">
        <div className="h-4 w-28 rounded-full bg-stone-200" />
        <div className="mt-4 h-12 w-full max-w-2xl rounded-2xl bg-stone-200" />
        <div className="mt-4 h-5 w-full max-w-3xl rounded-full bg-stone-100" />
        <div className="mt-2 h-5 w-2/3 rounded-full bg-stone-100" />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <div
            key={`${title}-${index}`}
            className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm"
          >
            <div className="aspect-[4/3] bg-stone-100" />
            <div className="space-y-4 p-6">
              <div className="h-6 w-2/3 rounded-full bg-stone-200" />
              <div className="h-4 w-full rounded-full bg-stone-100" />
              <div className="h-4 w-1/2 rounded-full bg-stone-100" />
              <div className="flex items-center justify-between pt-4">
                <div className="h-5 w-20 rounded-full bg-stone-200" />
                <div className="h-10 w-28 rounded-full bg-stone-200" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium text-slate-500">
        {title}. {description}
      </p>
    </div>
  );
}
