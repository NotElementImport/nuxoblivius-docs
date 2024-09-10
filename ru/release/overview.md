# Overview

Nuxoblivius - многофункциональный State-менеджер (далее - Store) для работы с данными между vue-компонентами. 

Поддерживаются Vue 3 и Nuxt 3. 

Используются принципы ООП и Sub-Store (хранилища внутри хранилищ).

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