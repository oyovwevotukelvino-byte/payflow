// src/components/dashboard/cards/activity-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox } from "lucide-react";

/**
 * Empty state only, per spec. Isolated so wiring a real activity feed
 * later is a self-contained change to this one file.
 */
export function ActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">No invoices yet.</p>
        </div>
      </CardContent>
    </Card>
  );
}