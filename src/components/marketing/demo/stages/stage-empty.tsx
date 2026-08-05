// components/marketing/demo/stages/stage-empty.tsx
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { fadeUp } from "../demo-variants";

/** Stage 1 — nothing has happened yet. The CTA here is the seed the rest of the demo grows from. */
export function StageEmpty() {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.35 }}
      className="flex h-full flex-col items-center justify-center gap-3 text-center"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
        <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-foreground">No invoices yet</p>
      <div className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white">
        Create invoice
      </div>
    </motion.div>
  );
}