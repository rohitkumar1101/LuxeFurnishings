import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1️⃣ Next.js + TS defaults
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 2️⃣ Project-specific overrides
  {
    // apply to all source files
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // disable the “no explicit any” error
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
