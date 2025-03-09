const eslintConfig = {
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: ["unicorn"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error",
    "react-hooks/exhaustive-deps": "error",
    "unicorn/filename-case": [
      "error",
      {
        case: "kebabCase",
        ignore: ["^[a-z0-9]+(?:-[a-z0-9]+)*$"]
      }
    ]
  }
};

export default eslintConfig;
