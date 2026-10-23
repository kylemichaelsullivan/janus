import janus from "eslint-plugin-janus";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["apps/**/*.{js,jsx,ts,tsx}", "packages/ui/src/**/*.{ts,tsx}", "packages/react/src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { janus },
    rules: janus.configs.recommended.rules,
  },
];
