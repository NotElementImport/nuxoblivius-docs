import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/nuxoblivius-docs/',
  ignoreDeadLinks: true,
  title: "Nuxoblivius",
  description: "A Power Store for Vue and Nuxt",
  themeConfig: {
    logoLink: '/nuxoblivius-docs/',
    logo: '/nuxoblivius-docs/NX-Logo-Temp.png',
    carbonAds: undefined,

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '1.0.0', link: '/release/overview' },
      { text: '0.4.X', link: '/beta/overview' },
      { text: 'Examples', link: '/markdown-examples/' }
    ],

    sidebar: [
      {
        text: '1.0.0',
        items: [
          { text: 'Overview', link: '/release/overview' },
          { text: 'Setup', link: '/release/setup' },
          { text: 'Store', link: '/release/store', items: [
            { text: 'Prop', link: '/release/store/prop',},
            { text: 'Prop (Encapsulation)', link: '/release/store/prop-encapsulation',},
            { text: 'Records', link: '/release/store/records',},
            { text: 'Storage', link: '/release/store/storage',},
            { text: 'Dynamic Params', link: '/release/store/dynamic-params',},
          ] },
          { text: 'Sub Stores', link: '/release/sub-store' },
          { text: 'Records', link: '/release/records' },
        ]
      },
      {
        text: '0.4.X',
        items: [
          { text: 'Overview', link: '/markdown-examples', rel: 'check' },
          { text: 'Setup', link: '/markdown-examples' },
          { text: 'Store', link: '/api-examples' }
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Release', link: '/markdown-examples' },
          { text: 'Beta', link: '/api-examples' }
        ]
      }
    ],

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ],

    footer: {
      copyright: "Powered by notelementimport & Perfect03",
      message: "Power store for Nuxt and Vue"
    }
  }
})
