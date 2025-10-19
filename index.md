---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  logo: /nuxoblivius-docs/nuxoblivius.png
  name: "Nuxoblivius"
  text: "Designed for clarity in complexity"
  actions:
    - theme: brand
      text: "Документация"
      link: /release/setup
    - theme: alt
      text: "Гайды"
      link: /release/guides/ssr
    # - theme: alt
    #   text: API Examples
    #   link: /examples/
---

## Особенности

<HomeEasy />

<HomeSeems />

<HomeElastic />

## Команда

<!-- # Установка пакета -->
<!---->
<!-- Установить nuxoblivius изспользуя комманду -->
<!---->
<!-- <section style="padding: 1em; padding-bottom: 0.1em; background: var(--vp-c-bg-elv); border-radius: 12px;"> -->
<!--   <div> -->
<!--     <span style="color: var(--vp-c-text-2); display: block; margin-bottom: -8px; font-size: 16px; font-weight: 500; text-transform: uppercase;"> -->
<!--       npm: -->
<!--     </span> -->
<!---->
<!-- ```shell -->
<!-- npm i nuxoblivius@latest -->
<!-- ``` -->
<!---->
<!--   </div> -->
<!---->
<!--   <div> -->
<!--     <span style="color: var(--vp-c-text-2); display: block; margin-bottom: -8px; margin-top: 1em; font-size: 16px; font-weight: 500; text-transform: uppercase;"> -->
<!--       pnpm: -->
<!--     </span> -->
<!---->
<!-- ```shell -->
<!-- pnpm i nuxoblivius@latest -->
<!-- ``` -->
<!---->
<!--   </div> -->
<!---->
<!--   <div> -->
<!--     <span style="color: var(--vp-c-text-2); display: block; margin-bottom: -8px; margin-top: 1em; font-size: 16px; font-weight: 500; text-transform: uppercase;"> -->
<!--       yarn: -->
<!--     </span> -->
<!---->
<!-- ```shell -->
<!-- yarn add nuxoblivius@latest -->
<!-- ``` -->
<!---->
<!--   </div> -->
<!-- </section> -->
<!---->
<!-- <br> -->
<!-- <br> -->
<!---->

<!-- # Наша команда -->
<!---->
<!-- Наша команда, которая разрабатывает данный пакет -->

<script setup>
const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/70256601?v=4',
    name: 'NotElementImport',
    title: 'Разработка, документация',
    links: [
      { icon: 'github', link: 'https://github.com/NotElementImport' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/kirill-panteleyev-4b487037b/' },
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/92153941?v=4',
    name: 'Perfect03',
    title: 'Разработка, документация',
    links: [
      { icon: 'github', link: 'https://github.com/Perfect03' },
    ]
  },
]
</script>

<div class="team">
  <VPTeamMembers size="small" :members="members" />
</div>
