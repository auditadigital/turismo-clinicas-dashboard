import { defineConfig } from "vitest/config";
import path from "node:path";

// `vitest run` en la raíz corre todos los tests (packages + apps) con esta config.
// - server-only: stub, porque repo.ts/client.ts lo importan y rompería en Node.
// - aliases a src: resuelve los paquetes del workspace sin necesidad de `build` previo.
export default defineConfig({
  resolve: {
    alias: {
      "server-only": path.resolve(__dirname, "apps/dashboard/test/server-only-stub.ts"),
      "@clinicas/types": path.resolve(__dirname, "packages/types/src/index.ts"),
      "@clinicas/db": path.resolve(__dirname, "packages/db/src/index.ts"),
      "@clinicas/ui": path.resolve(__dirname, "packages/ui/src/index.ts"),
    },
  },
  test: { include: ["packages/**/*.test.ts", "apps/**/*.test.ts"], environment: "node" },
});
