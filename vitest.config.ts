import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { configDefaults, defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  {
    plugins: [react()],
    test: {
      environment: "jsdom"
    },
    resolve: {
      alias: [{ find: "@", replacement: resolve(__dirname, "./src") }]
    }
  },
  defineConfig({
    test: {
      exclude: [
        ...configDefaults.exclude,
        "**/node_modules/**",
        "**/cypress/**"
      ]
    }
  })
);
