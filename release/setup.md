# Setup

Install to a project

```shell
npm i nuxoblivius@latest
```

And write rule to `tsconfig.json` (for work encapsulation, and read only)
```json
{
    "compilerOptions": {
        "strictNullChecks": false
    }
}
```

In Nuxt 3, write `NxNuxt` in `app.vue`
```vue
<script setup>
import NxNuxt from 'nuxoblivius/nxnuxt/index.vue'
</script>
<template>
    <NuxtLayout>
        <NxNuxt api-root="https://your-api.com/api" />
        <!-- Or -->
        <NxNuxt :api-root="useRuntimeConfig().public.api" />

        <NuxtPage />
    </NuxtLayout>
</template>
```