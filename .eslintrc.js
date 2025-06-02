/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ["node_modules/**", "build/**", "dist/**", "public/**"],
  plugins: ["@typescript-eslint", "unused-imports"],
  extends: [
    "next/core-web-vitals", 
    "plugin:@typescript-eslint/recommended", 
  ],
  rules: {
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],

    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },
};
