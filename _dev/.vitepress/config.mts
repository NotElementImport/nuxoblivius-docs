import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Nuxoblivius",
  description: "A Power Store for Vue and Nuxt",
  themeConfig: {
    logo: '/NX-Logo-Temp.png',
    carbonAds: undefined,

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '1.0.0', link: '/release/' },
      { text: '0.4.X', link: '/beta/' },
      { text: 'Examples', link: '/markdown-examples/' }
    ],

    sidebar: [
      {
        text: 'Release',
        items: [
          { text: 'Overview', link: '/release/overview' },
          { text: 'Setup', link: '/release/setup' },
          { text: 'Store', link: '/api-examples' },
          { text: 'Sub Stores', link: '/api-examples' },
          { text: 'Records', link: '/api-examples' },
          { text: 'Storage', link: '/api-examples' }
        ]
      },
      {
        text: 'Beta',
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
