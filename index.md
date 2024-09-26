---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  logo: /nuxoblivius-docs/nuxoblivius.png
  name: "Nuxoblivius"
  text: "A Power Store for"
  tagline: Vue 3 and Nuxt 3
  actions:
    - theme: brand
      text: "Docs"
      link: /release/setup
    - theme: alt
      text: "API"
      link: /beta/overview
    # - theme: alt
    #   text: API Examples
    #   link: /examples/

features:
  - title: 💡 Record
    details: Удобный Fetch API, с удобной типизацией, возможность кастомизации. Удобен для разработки SPA приложений
  - title: 💡 State Manager
    details: Использование классов и ООП для упрощения разработки приложений
  - title: 💡 Поддержка
    details: Постоянные обновления, и улучшения пакета
---

<br>
<br>

# ⚙ Setup

Установить nuxoblivius изспользуя комманду

<section style="padding: 1em; padding-bottom: 0.1em; background: var(--vp-c-bg-elv); border-radius: 12px;">
  <div>
    <span style="color: var(--vp-c-text-2); display: block; margin-bottom: -8px; font-size: 16px; font-weight: 500; text-transform: uppercase;">
      npm:
    </span>

```shell
npm i nuxoblivius@latest
```

  </div>

  <div>
    <span style="color: var(--vp-c-text-2); display: block; margin-bottom: -8px; margin-top: 1em; font-size: 16px; font-weight: 500; text-transform: uppercase;">
      pnpm:
    </span>

```shell
pnpm i nuxoblivius@latest
```

  </div>

  <div>
    <span style="color: var(--vp-c-text-2); display: block; margin-bottom: -8px; margin-top: 1em; font-size: 16px; font-weight: 500; text-transform: uppercase;">
      yarn:
    </span>

```shell
yarn add nuxoblivius@latest
```

  </div>
</section>

<br>
<br>


<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/70256601?v=4',
    name: 'NotElementImport',
    title: 'Придумал',
    links: [
      { icon: 'github', link: 'https://github.com/NotElementImport' },
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/92153941?v=4',
    name: 'Perfect03',
    title: 'Доработка, документация',
    links: [
      { icon: 'github', link: 'https://github.com/Perfect03' },
    ]
  },
]
</script>

# 🌐 Our Team

Команда, которая разрабатывает

<VPTeamMembers size="small" :members="members" />