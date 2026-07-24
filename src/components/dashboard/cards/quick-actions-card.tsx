// src/components/dashboard/cards/quick-actions-card.tsx
import { FilePlus, UserPlus, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Three inert action buttons per spec — no href, no onClick. Wiring real
 * behavior (navigate to invoice creation, etc.) is explicit future work,
 * not implied by this component's existence.
 */
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
        <Button variant="outline" className="flex-1 justify-start gap-2" disabled>
          <UserPlus className="h-4 w-4" />
          Add customer
        </Button>
        <Button variant="outline" className="flex-1 justify-start gap-2" disabled>
          <CreditCard className="h-4 w-4" />
          View payments
        </Button>
      </CardContent>
    </Card>
  );
}