import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray lockfile in the home dir isn't used.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
