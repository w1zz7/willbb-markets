"use client";

/**
 * Standalone entry for the willBB Markets Terminal.
 *
 * Renders the full Bloomberg-style terminal fullscreen (no Win98 chrome).
 * For the desktop-framed version (where willBB is one of many apps inside
 * a Windows 98 desktop) see https://github.com/w1zz7/willos-98-portfolio.
 *
 * The OpenBB component accepts a `window: WindowState` prop from the parent
 * window manager. In the standalone, we pass a stub state since there's
 * no surrounding WM — the terminal IS the whole page.
 */

import WillBBTerminal from "@/components/apps/willbb/OpenBB";
import type { WindowState } from "@/lib/wm/types";

const STANDALONE_WINDOW: WindowState = {
  id: "willbb-standalone",
  appId: "willbb",
  fullscreen: true,
};

export default function Page() {
  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        background: "#151518",
        color: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <WillBBTerminal window={STANDALONE_WINDOW} />
    </main>
  );
}
