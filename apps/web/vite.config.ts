import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { devtools } from "@tanstack/devtools-vite";

export default defineConfig({
  plugins: [devtools(), tsconfigPaths(), tanstackStart(), viteReact()],
  server: {
    port: 3000,
  },
});
