# Overview

Nuxoblivius is Power Store for Vue 3 and Nuxt 3. Using OOP and Sub Store system 

Example:

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