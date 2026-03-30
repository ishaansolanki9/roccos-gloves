import {
  addColor,
  deleteColor,
  logoutAdmin,
  toggleColorAvailability,
  updateColor,
  updateProductPrice,
} from "@/app/admin/actions";

type AdminDashboardProps = {
  adminUser: {
    name: string | null;
    email: string;
    role: string;
  };
  errorMessage?: string;
  colors: Array<{
    id: string;
    name: string;
    slug: string;
    hexCode: string;
    isAvailable: boolean;
  }>;
  products: Array<{
    id: string;
    name: string;
    slug: string;
    basePrice: string;
    status: string;
  }>;
};

export function AdminDashboard({
  adminUser,
  errorMessage,
  colors,
  products,
}: AdminDashboardProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Admin</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Manage colors and product pricing.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Signed in as {adminUser.name ?? adminUser.email}. Update colors, availability, and
            prices directly in PostgreSQL through Prisma-backed server actions.
          </p>
        </div>

        <form action={logoutAdmin}>
          <button
            type="submit"
            className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
          >
            Sign Out
          </button>
        </form>
      </div>

      {errorMessage ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <StatCard label="Products" value={String(products.length)} />
        <StatCard label="Colors" value={String(colors.length)} />
        <StatCard
          label="Available Colors"
          value={String(colors.filter((color) => color.isAvailable).length)}
        />
      </section>

      <section className="mt-12 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Color Library</h2>
              <p className="mt-2 text-sm text-slate-600">
                Add, edit, remove, and toggle color availability.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-stone-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Add Color</h3>
            <form action={addColor} className="mt-4 grid gap-4 md:grid-cols-2">
              <AdminInput name="name" label="Name" placeholder="Black" />
              <AdminInput name="slug" label="Slug" placeholder="black" />
              <AdminInput name="hexCode" label="Hex Code" placeholder="#111111" />
              <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                <input type="checkbox" name="isAvailable" defaultChecked className="h-4 w-4" />
                Available for customers
              </label>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="rounded-full bg-brand-800 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Add Color
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 space-y-4">
            {colors.map((color) => (
              <article key={color.id} className="rounded-[1.5rem] border border-stone-200 p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <form action={updateColor} className="grid flex-1 gap-4 md:grid-cols-2">
                    <input type="hidden" name="colorId" value={color.id} />
                    <AdminInput name="name" label="Name" defaultValue={color.name} />
                    <AdminInput name="slug" label="Slug" defaultValue={color.slug} />
                    <AdminInput name="hexCode" label="Hex Code" defaultValue={color.hexCode} />
                    <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        defaultChecked={color.isAvailable}
                        className="h-4 w-4"
                      />
                      Available
                    </label>
                    <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        className="rounded-full bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>

                  <div className="flex items-center gap-3">
                    <span
                      className="h-10 w-10 rounded-full border border-stone-200"
                      style={{ backgroundColor: color.hexCode }}
                    />
                    <form action={toggleColorAvailability}>
                      <input type="hidden" name="colorId" value={color.id} />
                      <input type="hidden" name="isAvailable" value={String(color.isAvailable)} />
                      <button
                        type="submit"
                        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700"
                      >
                        {color.isAvailable ? "Disable" : "Enable"}
                      </button>
                    </form>
                    <form action={deleteColor}>
                      <input type="hidden" name="colorId" value={color.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:border-red-300 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Product Pricing</h2>
          <p className="mt-2 text-sm text-slate-600">
            Adjust pricing for active or draft products without editing code.
          </p>

          <div className="mt-8 space-y-4">
            {products.map((product) => (
              <form
                key={product.id}
                action={updateProductPrice}
                className="rounded-[1.5rem] border border-stone-200 p-5"
              >
                <input type="hidden" name="productId" value={product.id} />
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{product.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      /products/{product.slug} • {product.status}
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Base Price
                    </label>
                    <input
                      type="number"
                      name="basePrice"
                      min="0"
                      step="0.01"
                      defaultValue={product.basePrice}
                      className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-brand-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-full bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    Update Price
                  </button>
                </div>
              </form>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-brand-800">{value}</p>
    </article>
  );
}

type AdminInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
};

function AdminInput({ name, label, placeholder, defaultValue }: AdminInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required
        className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-brand-500"
      />
    </div>
  );
}
