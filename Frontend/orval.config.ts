import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "https://localhost:7229/openapi/v1.json",
    },
    output: {
      target: "./generated/api.ts",
      schemas: "./generated/models",
      client: "fetch",
      mode: "split",
      clean: true,
    },
  },
});