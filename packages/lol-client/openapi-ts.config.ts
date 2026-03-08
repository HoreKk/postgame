import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://raw.githubusercontent.com/vickz84259/lolesports-api-docs/master/openapi.yaml",
  output: {
    path: "./src/client",
    postProcess: ["prettier", "eslint"],
  },
  plugins: [
    "@hey-api/schemas",
    {
      enums: "javascript",
      name: "@hey-api/typescript",
    },
    "@tanstack/react-query",
  ],
});
