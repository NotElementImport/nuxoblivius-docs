# Store - Свойство

Хранилище состоит из полей (свойств), которые могут быть реактивными, либо нет, а также приватными, либо публичными:
```ts
import {defineStore} from 'nuxoblivius'

class Example {
    // реактивно; публичное
    public field1: number = 0

    // не реактивно; приватное
    private _field2: number = 0
}

export default defineStore<Example>(Example)
```

Нереактивными будут свойства, названия которых начинаются на `_`.

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
        <!-- После монтирования стало равно 10 -->
        {{ Example.field1 }}
        <!-- После монтирования осталось равным 0, т.к. свойство не реактивно -->
        {{ Example._field2 }}
    </div>
</template>
```

# Ref 

К каждому свойству хранилища можно обратиться через объект `ref`:

```vue
<template>
    <div>
        <!-- Returned value of field1: 10 -->
        {{ Example.ref.field1.value }}
    </div>
</template>
```

, содержащий:
```ts
interface IRef<T> {
    // Имя поля
    name: string

    // Значение
    get value(): T

    // Информация, пусто ли поле
    get isEmpty(): boolean

    // Watch-ер для отслеживания изменений значения
    watch(callback: Function): void
}
```