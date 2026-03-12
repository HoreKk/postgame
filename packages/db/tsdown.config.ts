import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/schema/index.ts", "src/schema/auth.ts"],
  format: "esm",
  outExtensions: () => ({ js: ".js" }),
  dts: true,
  clean: true,
});
