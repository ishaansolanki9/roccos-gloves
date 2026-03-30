export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-6 py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="aspect-[4/3] rounded-[1.5rem] bg-stone-100" />
        </div>
        <div>
          <div className="h-4 w-24 rounded-full bg-stone-200" />
          <div className="mt-4 h-12 w-full rounded-2xl bg-stone-200" />
          <div className="mt-4 h-5 w-full rounded-full bg-stone-100" />
          <div className="mt-2 h-5 w-3/4 rounded-full bg-stone-100" />
          <div className="mt-8 h-10 w-32 rounded-2xl bg-stone-200" />
          <div className="mt-10 rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="h-6 w-48 rounded-full bg-stone-200" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`product-option-${index}`}>
                  <div className="mb-2 h-4 w-24 rounded-full bg-stone-100" />
                  <div className="h-12 rounded-xl bg-stone-100" />
                </div>
              ))}
            </div>
            <div className="mt-6 h-12 rounded-full bg-stone-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
