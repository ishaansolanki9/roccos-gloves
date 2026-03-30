export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-6 py-16">
      <div className="h-4 w-20 rounded-full bg-stone-200" />
      <div className="mt-4 h-12 w-full max-w-3xl rounded-2xl bg-stone-200" />
      <div className="mt-4 h-5 w-full max-w-2xl rounded-full bg-stone-100" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`admin-stat-${index}`}
            className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="h-4 w-24 rounded-full bg-stone-100" />
            <div className="mt-4 h-10 w-20 rounded-2xl bg-stone-200" />
          </div>
        ))}
      </div>
      <div className="mt-12 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="h-8 w-48 rounded-2xl bg-stone-200" />
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`admin-color-${index}`}
                className="h-40 rounded-[1.5rem] bg-stone-100"
              />
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="h-8 w-48 rounded-2xl bg-stone-200" />
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`admin-product-${index}`}
                className="h-32 rounded-[1.5rem] bg-stone-100"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
