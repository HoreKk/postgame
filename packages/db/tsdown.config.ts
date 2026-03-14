import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/**/*.ts"],
  format: "esm",
  outExtensions: () => ({ js: ".js" }),
  dts: true,
  clean: true,
  hash: false,
});
