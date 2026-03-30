"use client";

type RouteErrorProps = {
  title?: string;
  description?: string;
  reset: () => void;
};

export function RouteError({
  title = "Something went wrong",
  description = "The page hit an unexpected issue. You can try again.",
  reset,
}: RouteErrorProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Error</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-brand-800 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
