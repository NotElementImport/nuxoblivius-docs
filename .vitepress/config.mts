import { defineConfig } from 'vitepress'
import { h } from 'vue'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/nuxoblivius-docs/',
  ignoreDeadLinks: true,
  title: "Nuxoblivius",
  description: "A Power Store for Vue and Nuxt",

  assetsDir: '',

  head: [
    ['link', { rel: 'icon', href: '/nuxoblivius-docs/nuxoblivius.png', type: 'image/png' }]
  ],

  markdown: {
    lineNumbers: true,
  },

  // locales: {
  //   root: {
  //     label: 'English',
  //     lang: 'en',
  //     link: ''
  //   },
  //   ru: {
  //     label: 'Русский',
  //     lang: 'ru',
  //     link: '/ru',
  //   }
  // },

  themeConfig: {
    logoLink: '/nuxoblivius-docs/',
    logo: '/nuxoblivius.png',

    carbonAds: undefined,

    nav: [
      { text: 'Docs', link: '/release/setup' },
      // { text: '0.5.x', link: '/beta/overview' },
    ],

    sidebar: [
      {
        text: '1.7.X',
        items: [
          // { text: 'Overview', link: '/release/overview' },
          {
            text: 'Установка', link: '/release/setup', items: [
              { text: 'Nuxt', link: '/release/nuxt' },
            ]
          },
          { text: 'State Manager', link: '/release/state-manager' },
          // { text: 'Record (Fetch)', link: '/release/record' },
          // { text: 'Store', link: '/release/store', items: [
          // { text: 'Prop', link: '/release/store/prop',},
          // { text: 'Prop (Encapsulation)', link: '/release/store/prop-encapsulation',},
          // { text: 'Records', link: '/release/store/records',},
          // { text: 'Storage', link: '/release/store/storage',},
          // { text: 'Dynamic Params', link: '/release/store/dynamic-params',},
          // ] },
          // { text: 'Sub Stores', link: '/release/sub-store' },
          { text: 'Record (Fetch)', link: '/release/record' },
          // { text: 'Records', link: '/release/records' },
          { text: 'Global Functions', link: '/release/global-functions' },
          { text: 'Records Caching', link: '/release/records-caching' },
        ]
      },
      {
        text: '0.5.4 (deprecated)',
        items: [
          { text: 'Setup', link: '/beta/setup' },
          {
            text: 'Store', link: '/beta/store/defineStore', items: [
              { text: 'Methods', link: '/beta/store/methods', },
              { text: 'Filter', link: '/beta/store/filter', },
            ]
          },
          { text: 'Usage', link: '/beta/usage' },
        ]
      },
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Release', link: '/markdown-examples' },
      //     { text: 'Beta', link: '/api-examples' }
      //   ]
      // }
    ],

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ],

    footer: {
      copyright: "Created by notelementimport & Perfect03",
      message: "Power utils for Vue"
    }
  }
})
