import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sites } from "@openai/sites-vite-plugin";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

function preserveStaticContracts() {
  const directories = ["assets", "data"];
  const files = ["robots.txt", "site.webmanifest", "sitemap.xml"];

  return {
    name: "nexus-static-contracts",
    apply: "build",
    async closeBundle() {
      await mkdir(path.join(root, "dist"), { recursive: true });

      for (const directory of directories) {
        await cp(path.join(root, directory), path.join(root, "dist", directory), {
          recursive: true,
          force: true,
        });
      }

      for (const file of files) {
        await cp(path.join(root, file), path.join(root, "dist", file), {
          force: true,
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [sites(), preserveStaticContracts()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
