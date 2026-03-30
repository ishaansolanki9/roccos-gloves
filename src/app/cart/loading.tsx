export default function CartLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-6 py-16">
      <div className="h-4 w-20 rounded-full bg-stone-200" />
      <div className="mt-4 h-12 w-full max-w-2xl rounded-2xl bg-stone-200" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`cart-skeleton-${index}`}
              className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="h-32 rounded-2xl bg-stone-100 sm:w-36" />
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-48 rounded-full bg-stone-200" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((__, detailIndex) => (
                      <div key={`cart-detail-${detailIndex}`} className="space-y-2">
                        <div className="h-4 w-24 rounded-full bg-stone-100" />
                        <div className="h-5 w-32 rounded-full bg-stone-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-40 rounded-full bg-stone-200" />
          <div className="mt-6 space-y-4">
            <div className="h-4 w-full rounded-full bg-stone-100" />
            <div className="h-4 w-5/6 rounded-full bg-stone-100" />
            <div className="h-12 rounded-full bg-stone-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
