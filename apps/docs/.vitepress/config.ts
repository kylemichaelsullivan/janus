import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Janus",
  description: "Hybrid Web + Native UI from a single source",
  srcDir: "../../docs",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Executive summary", link: "/executive-summary" },
      { text: "Concepts", link: "/concepts" },
      { text: "Catalog", link: "/catalog" },
    ],
    sidebar: [
      { text: "Executive summary", link: "/executive-summary" },
      { text: "Concepts", link: "/concepts" },
      { text: "Mapping", link: "/mapping" },
      { text: "Overrides", link: "/overrides" },
      { text: "Styling", link: "/styling" },
      { text: "Accessibility", link: "/a11y" },
      { text: "Catalog", link: "/catalog" },
      { text: "CLI", link: "/cli" },
      { text: "Migrate", link: "/migrate" },
    ],
  },
});
