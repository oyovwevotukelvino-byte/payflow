import type { ComponentType } from "react";

import { StageBuilder } from "./stages/stage-builder";
import { StageCheckout } from "./stages/stage-checkout";
import { StageComplete } from "./stages/stage-complete";
import { StageDashboard } from "./stages/stage-dashboard";
import { StageEmpty } from "./stages/stage-empty";
import { StageInvoice } from "./stages/stage-invoice";
import { StageSuccess } from "./stages/stage-success";
import { StageWhatsApp } from "./stages/stage-whatsapp";

export interface DemoStageDefinition {
  label: string;
  description: string;
  Component: ComponentType;
}

/** The product UI and copy shared by the desktop and mobile presentations. */
export const DEMO_STAGES: readonly DemoStageDefinition[] = [
  {
    label: "Start with nothing",
    description: "A clean dashboard, ready for your first invoice.",
    Component: StageEmpty,
  },
  {
    label: "Create the invoice",
    description: "Choose the customer and enter the amount.",
    Component: StageBuilder,
  },
  {
    label: "Your invoice is ready",
    description: "PayFlow creates a professional invoice and payment link.",
    Component: StageInvoice,
  },
  {
    label: "Send it on WhatsApp",
    description: "Your customer receives everything in one familiar message.",
    Component: StageWhatsApp,
  },
  {
    label: "Your customer pays",
    description: "They open the secure payment page and choose how to pay.",
    Component: StageCheckout,
  },
  {
    label: "Payment successful",
    description: "The customer pays and PayFlow records it immediately.",
    Component: StageSuccess,
  },
  {
    label: "Dashboard updates",
    description: "Payment arrives and every number updates instantly.",
    Component: StageDashboard,
  },
  {
    label: "You are all caught up",
    description: "The payment is confirmed and your customer is notified.",
    Component: StageComplete,
  },
];
