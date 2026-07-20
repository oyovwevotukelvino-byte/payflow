// components/auth/auth-header.tsx
export function AuthHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--pf-ink)]">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--pf-ink-muted)]">
        {description}
      </p>
    </div>
  );
}