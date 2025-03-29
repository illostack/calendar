import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import onlyWarn from "eslint-plugin-only-warn";
import turboPlugin from "eslint-plugin-turbo";
import unicornPlugin from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      unicorn: unicornPlugin
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "prefer-const": "error",
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["^[a-z0-9]+(?:-[a-z0-9]+)*$"]
        }
      ]
    }
  },
  {
    plugins: {
      onlyWarn
    }
  },
  {
    ignores: ["dist/**"]
  }
];
