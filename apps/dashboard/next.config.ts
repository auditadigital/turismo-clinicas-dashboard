import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@clinicas/ui", "@clinicas/types"],
};

export default nextConfig;
