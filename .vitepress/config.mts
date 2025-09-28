import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid({
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
    sidebarMenuLabel: 'Меню',
    returnToTopLabel: 'Перейти на вверх',
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "Поиск по документации"
          }
        }
      }
    },
    outlineTitle: "В этой статье",
    darkModeSwitchLabel: "Темная тема",

    carbonAds: undefined,

    nav: [
      { text: 'Документация', link: '/release/setup' },
      { text: 'Гайды', link: '/release/guides/ssr' },
    ],

    sidebar: [
      {
        text: '1.7.X',
        items: [
          {
            text: 'Установка', link: '/release/setup', items: [
              { text: 'Nuxt', link: '/release/nuxt' },
            ]
          },
          { text: 'State Manager', link: '/release/state-manager' },
          {
            text: 'Record (Запросы API)', items: [
              { text: 'Базовые настройки', link: `/release/record/base` },
              { text: 'Продвинутые настройки', link: `/release/record/advanced` },
              { text: 'Модуль: Трансформация', link: `/release/record/template` },
              { text: 'Модуль: Пагинация', link: `/release/record/pagination` },
              { text: 'Модуль: Взаимствование', link: `/release/record/borrow` },
              { text: 'Модуль: Кэширование', link: `/release/record/cache` },
            ]
          },
          { text: 'Общие настройки', link: '/release/global-functions' },
        ]
      },
      {
        text: '1.7.x Гайды',
        items: [
          { text: 'Работа с SSR', link: '/release/guides/ssr' },
          { text: 'Работа с DI', link: '/release/guides/di' },
          { text: 'Работа с JWT', link: '/release/guides/jwt' }
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
    ],

    socialLinks: [
      { icon: 'npm', link: 'https://www.npmjs.com/package/nuxoblivius' },
      { icon: 'github', link: 'https://github.com/NotElementImport/nuxoblivius-package' },
      {
        icon: {
          svg: '<svg id="Livello_1" data-name="Livello 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 240 240"><defs><linearGradient id="linear-gradient" x1="120" y1="240" x2="120" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1d93d2"/><stop offset="1" stop-color="#38b0e3"/></linearGradient></defs><title>Telegram_logo</title><circle cx="120" cy="120" r="120" fill="url(#linear-gradient)"/><path d="M81.229,128.772l14.237,39.406s1.78,3.687,3.686,3.687,30.255-29.492,30.255-29.492l31.525-60.89L81.737,118.6Z" fill="#c8daea"/><path d="M100.106,138.878l-2.733,29.046s-1.144,8.9,7.754,0,17.415-15.763,17.415-15.763" fill="#a9c6d8"/><path d="M81.486,130.178,52.2,120.636s-3.5-1.42-2.373-4.64c.232-.664.7-1.229,2.1-2.2,6.489-4.523,120.106-45.36,120.106-45.36s3.208-1.081,5.1-.362a2.766,2.766,0,0,1,1.885,2.055,9.357,9.357,0,0,1,.254,2.585c-.009.752-.1,1.449-.169,2.542-.692,11.165-21.4,94.493-21.4,94.493s-1.239,4.876-5.678,5.043A8.13,8.13,0,0,1,146.1,172.5c-8.711-7.493-38.819-27.727-45.472-32.177a1.27,1.27,0,0,1-.546-.9c-.093-.469.417-1.05.417-1.05s52.426-46.6,53.821-51.492c.108-.379-.3-.566-.848-.4-3.482,1.281-63.844,39.4-70.506,43.607A3.21,3.21,0,0,1,81.486,130.178Z" fill="#fff"/></svg>'
        }, link: 'https://t.me/package_nuxoblivius'
      },
    ],

    footer: {
      copyright: "Created by notelementimport & Perfect03",
      message: "Power utils for Vue"
    }
  }
})
