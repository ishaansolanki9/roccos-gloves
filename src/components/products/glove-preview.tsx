type GlovePreviewProps = {
  productName: string;
  primaryColor: {
    name: string;
    hexCode: string;
  } | null;
  secondaryColor: {
    name: string;
    hexCode: string;
  } | null;
  trimColor: {
    name: string;
    hexCode: string;
  } | null;
  customText: string;
};

export function GlovePreview({
  productName,
  primaryColor,
  secondaryColor,
  trimColor,
  customText,
}: GlovePreviewProps) {
  const primary = primaryColor?.hexCode ?? "#7f9bb7";
  const secondary = secondaryColor?.hexCode ?? "#d8e1eb";
  const trim = trimColor?.hexCode ?? "#d97706";
  const stitchedText = customText.trim().slice(0, 12) || "YOUR TEXT";

  return (
    <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(248,250,252,1)_55%,_rgba(226,232,240,1))] p-6 shadow-sm">
      <div className="rounded-[1.5rem] border border-white/80 bg-white/70 p-4 backdrop-blur">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Live Preview
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
              {productName}
            </h2>
          </div>
          <div className="flex gap-2">
            <ColorDot label="Primary" color={primary} />
            <ColorDot label="Secondary" color={secondary} />
            <ColorDot label="Trim" color={trim} />
          </div>
        </div>

        <div className="relative aspect-[4/3] rounded-[1.5rem] bg-gradient-to-br from-white to-stone-100">
          <svg
            viewBox="0 0 500 380"
            className="h-full w-full drop-shadow-[0_24px_40px_rgba(15,23,42,0.18)]"
            role="img"
            aria-label="Glove customization preview"
          >
            <path
              d="M215 54c14-23 51-32 74-10 13 12 17 32 12 50l-18 67 36-46c18-23 51-25 69-6 18 19 18 51-1 71l-36 39 42-18c23-10 48-2 60 18 11 18 7 42-10 57l-67 58c-30 26-70 39-110 36l-55-4c-26-2-51-11-72-27l-41-30c-29-22-34-64-11-92l60-73-19-46c-10-24 0-52 23-64 24-12 53-3 64 20l20 40 10-59c3-18 12-35 27-46Z"
              fill={primary}
            />
            <path
              d="M186 104c9-16 31-22 47-12 15 9 22 28 17 45l-25 84 51-52c12-13 33-13 46 0 13 13 13 34 0 47l-66 67c-15 15-38 18-56 8l-51-28c-21-11-28-38-15-58l52-81Z"
              fill={secondary}
              opacity="0.92"
            />
            <path
              d="M165 83c5 0 10 4 11 10l8 42c1 7-3 13-10 15-6 1-13-3-15-10l-8-42c-1-7 3-13 10-15h4Zm70-41c5 0 10 4 11 10l5 39c1 6-4 12-11 13-6 1-12-4-13-11l-5-39c-1-6 4-12 11-13h2Zm84 18c5-3 13-1 16 4l17 31c3 6 1 13-4 17-6 3-13 1-17-5l-17-31c-3-5-1-13 5-16Zm60 85c5-4 13-3 17 2l18 22c5 5 4 13-1 18-6 4-14 3-18-2l-18-22c-4-5-3-13 2-18ZM102 230l64 47m-35-89l86 48m-12 80 40-59"
              fill="none"
              stroke={trim}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="12"
            />
            <path
              d="M129 200c24 27 52 48 84 61"
              fill="none"
              stroke="#fff"
              strokeLinecap="round"
              strokeWidth="7"
              opacity="0.45"
            />
            <text
              x="214"
              y="292"
              textAnchor="middle"
              fontSize="22"
              fontWeight="700"
              letterSpacing="2"
              fill={trim}
              style={{ textTransform: "uppercase" }}
            >
              {stitchedText}
            </text>
          </svg>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <LegendCard title="Primary" name={primaryColor?.name ?? "Not selected"} color={primary} />
          <LegendCard
            title="Secondary"
            name={secondaryColor?.name ?? "Not selected"}
            color={secondary}
          />
          <LegendCard title="Trim" name={trimColor?.name ?? "Not selected"} color={trim} />
        </div>
      </div>
    </div>
  );
}

function ColorDot({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="h-4 w-4 rounded-full border border-white shadow-sm"
      style={{ backgroundColor: color }}
      aria-label={label}
      title={label}
    />
  );
}

function LegendCard({
  title,
  name,
  color,
}: {
  title: string;
  name: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-white/80 p-3">
      <div className="flex items-center gap-3">
        <span
          className="h-4 w-4 rounded-full border border-stone-200"
          style={{ backgroundColor: color }}
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {title}
          </p>
          <p className="text-sm font-semibold text-slate-900">{name}</p>
        </div>
      </div>
    </div>
  );
}
