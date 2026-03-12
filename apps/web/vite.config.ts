import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [tanstackStart(), nitro(), viteReact()],
  resolve: { tsconfigPaths: true },
  server: {
    port: Number(process.env.PORT) || 3000,
    allowedHosts: true,
  },
});
