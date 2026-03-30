import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center px-6 py-16">
      <div className="grid w-full gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            Admin Access
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950">
            Manage colors and pricing from one secure dashboard.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Sign in as an admin to update your glove catalog, control color availability, and
            adjust product pricing without editing code.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
