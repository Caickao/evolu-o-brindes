import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Carrega o .env (DATABASE_URL etc) para o processo de teste — alguns
    // arquivos testados importam módulos que instanciam o Prisma Client no
    // topo do arquivo, mesmo quando o teste em si não bate no banco.
    env: loadEnv("", process.cwd(), ""),
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
