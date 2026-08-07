// src/components/dashboard/cards/quick-actions-card.tsx
import Link from "next/link";
import { FilePlus, UserPlus, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" className="flex-1 justify-start gap-2" disabled>
          <FilePlus className="h-4 w-4" />
          Create invoice
        </Button>

        <Button asChild variant="outline" className="flex-1 justify-start gap-2">
          <Link href="/customers">
            <UserPlus className="h-4 w-4" />
            Add customer
          </Link>
        </Button>

        <Button variant="outline" className="flex-1 justify-start gap-2" disabled>
          <CreditCard className="h-4 w-4" />
          View payments
        </Button>
      </CardContent>
    </Card>
  );
}