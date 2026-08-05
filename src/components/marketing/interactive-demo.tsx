"use client";

import { DesktopDemo } from "./demo/desktop-demo";
import { MobileDemo } from "./demo/mobile-demo";

export function InteractiveDemo() {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopDemo />
      </div>

      <div className="block lg:hidden">
        <MobileDemo />
      </div>
    </>
  );
}
