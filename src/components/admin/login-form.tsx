"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/login/actions";

const initialState = {
  error: "",
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Admin Login</h2>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-brand-500"
            placeholder="admin@roccogloves.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-brand-500"
            placeholder="Enter your password"
          />
        </div>

        {state.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-brand-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
