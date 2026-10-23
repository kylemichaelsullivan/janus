import janus from "eslint-plugin-janus";

export default [
  {
    files: ["apps/**/*.{js,jsx,ts,tsx}", "packages/ui/src/**/*.{ts,tsx}"],
    plugins: { janus },
    rules: janus.configs.recommended.rules,
  },
];
