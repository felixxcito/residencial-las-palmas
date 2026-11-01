import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // Registration is done manually (see RegisterServiceWorker) — this plugin's
  // automatic main-app entry injection doesn't reach the client bundle on
  // current Next.js versions, so relying on it would silently no-op.
  register: false,
  workboxOptions: {
    skipWaiting: true,
  },
});

const nextConfig: NextConfig = {
  // next-pwa attaches a webpack() hook (used only for the production build,
  // since PWA generation is disabled in dev); this silences Turbopack's
  // dev-time warning about an unacknowledged webpack config.
  turbopack: {},
};

export default withPWA(nextConfig);
