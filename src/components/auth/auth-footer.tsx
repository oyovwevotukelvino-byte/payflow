// components/auth/auth-footer.tsx
import Link from "next/link";

export function AuthFooter({
  prompt,
  linkText,
  href,
}: {
  prompt: string;
  linkText: string;
  href: string;
}) {
  return (
    <p className="mt-8 text-center text-sm text-[var(--pf-ink-muted)]">
      {prompt}{" "}
      <Link
        href={href}
        className="font-medium text-[var(--pf-brand)] underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
      >
        {linkText}
      </Link>
    </p>
  );
}