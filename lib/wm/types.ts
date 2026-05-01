/**
 * Minimal stub for the willBB Window Manager state type.
 *
 * The full WillOS-98 window manager lives at https://github.com/w1zz7/willos-98-portfolio.
 * The standalone willBB terminal doesn't have a WM (the terminal IS the
 * whole site) but the OpenBB component still accepts a `window: WindowState`
 * prop for compat. We pass a minimal stub on mount.
 */
export type AppId = "willbb";

export interface WindowState {
  id: string;
  appId: AppId;
  fullscreen?: boolean;
}
