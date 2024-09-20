---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  logo: /NX-Logo-Temp.png
  name: "Nuxoblivius"
  text: "A Power Store for"
  tagline: Vue 3 and Nuxt 3
  actions:
    - theme: brand
      text: "Docs v 1.0"
      link: /release/overview
    - theme: alt
      text: "Docs v 0.5.x"
      link: /beta/overview
    - theme: alt
      text: API Examples
      link: /examples/

features:
  - title: Ease Query To API
    details: "Create Records for fetching data from API easyly with many functions. With SSR Support"
  - title: Reactive without ref()
    details: Use OOP for controll in project, and dont worry about less reactivity
  - title: Keep data and use again
    details: Easy work for storing data in Client
---

<br>
<br>

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/70256601?v=4',
    name: 'NotElementImport',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/NotElementImport' },
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/92153941?v=4',
    name: 'Perfect03',
    title: 'Docs Co-writer',
    links: [
      { icon: 'github', link: 'https://github.com/Perfect03' },
    ]
  },
]
</script>

# Our Team

Say hello to our awesome team.

<VPTeamMembers size="small" :members="members" />