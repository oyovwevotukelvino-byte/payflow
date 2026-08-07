// app/(dashboard)/customers/error.tsx
"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomersError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
      <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
      <p className="text-sm font-medium text-foreground">Couldn&apos;t load your customers.</p>
      <p className="text-sm text-muted-foreground">Something went wrong on our end.</p>
      <Button onClick={reset} variant="outline" className="mt-2">
        Try again
      </Button>
    </div>
  );
}