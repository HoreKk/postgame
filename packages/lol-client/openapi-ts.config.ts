import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://raw.githubusercontent.com/vickz84259/lolesports-api-docs/master/openapi.yaml",
  output: {
    path: "./src/client",
    postProcess: ["prettier", "eslint"],
  },
  plugins: [
    {
      bigInt: true,
      name: "@hey-api/transformers",
    },
    {
      name: "@hey-api/schemas",
      type: "json",
    },
    {
      enums: "javascript",
      name: "@hey-api/typescript",
    },
    {
      name: "@hey-api/sdk",
      transformer: true,
    },
    "@tanstack/react-query",
  ],
});
