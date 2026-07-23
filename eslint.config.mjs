import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "test-results/**",
      "playwright-report/**",
    ],
  },
  ...coreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
