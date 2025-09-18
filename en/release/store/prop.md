# Store - Prop

`Prop` - is field (reactive or not)

Prop exist two types:
```ts
import {defineStore} from 'nuxoblivius'

class Example {
    // reactive
    public field1: number = 0

    // not reactive
    private _field2: number = 0
}

export default defineStore<Example>(Example)
```

Reactive `Prop` define basicly, none reactive define with `_`

```vue
<script setup lang="ts">
import Example from '@/store/Example.ts'

onMounted(() => {
    Example.field1 = 10
    Example._field2 = 10
})
</script>
<template>
    <div>
        <!-- After Mounted: 10 -->
        {{ Example.field1 }}
        <!-- After Mounted: 0 (Cannot be modified in Vue files) -->
        {{ Example._field2 }}
    </div>
</template>
```

Any `Prop` had `ref` (reference object) version.

Example: 
```vue
<template>
    <div>
        <!-- Returned value of field1: 10 -->
        {{ Example.ref.field1.value }}
    </div>
</template>
```

`ref` had this structure:
```ts
interface IRef<T> {
    // Name of Field
    name: string

    // Value of Field
    get value(): T

    // Is empty Field
    get isEmpty(): boolean

    // Check if name field start with $
    // Can locked procces while empty
    get isImportant(): boolean

    // Track to changes
    watch(callback: Function): void
}
```