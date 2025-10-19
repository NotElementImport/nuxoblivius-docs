import DefaultTheme from "vitepress/theme";
import "./custom.css";
import type { Theme } from "vitepress";

import { VPTeamMembers } from "vitepress/theme";
import HomeEasy from "../components/HomeEasy.vue";
import HomeSeems from "../components/HomeSeems.vue";
import HomeElastic from "../components/HomeElastic.vue";

export default {
  extends: DefaultTheme,
  async enhanceApp({ app, router }) {
    app.component("HomeEasy", HomeEasy);
    app.component("HomeSeems", HomeSeems);
    app.component("HomeElastic", HomeElastic);
    app.component("VPTeamMembers", VPTeamMembers);
  },
} satisfies Theme;
