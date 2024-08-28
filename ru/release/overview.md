# Аннотация

Nuxoblivius - это Power Store для Vue 3 и Nuxt 3. Использование ООП и системы Sub Store 

Пример:

```ts
import {defineStore} from 'nuxoblivius'

class MyExampleStore {
    public myValue: string = "Hello World!"
}

export defineStore<MyExampleStore>(MyExampleStore)
```

```vue
<script setup lang="ts">
import MyExampleStore from '@/store/MyExampleStore'
</script>
<template>
    <!-- Reactive: "Hello World!" -->
    {{ MyExampleStore.myValue }}
</temptale>
```