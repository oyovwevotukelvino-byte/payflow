import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold">
        PayFlow
      </h1>

      <p className="text-muted-foreground">
        WhatsApp-first invoicing for Nigerian businesses.
      </p>

      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="rounded bg-black px-5 py-3 text-white"
        >
          Sign In
        </Link>

        <Link
          href="/sign-up"
          className="rounded border px-5 py-3"
        >
          Create Account
        </Link>
      </div>
    </main>
  );
}