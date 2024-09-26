# State Manager

В Nuxoblivius-е есть свой state manager. Используются классы для создания state manager-а.

Простой реактивный state-manager

::: code-group
```ts [Singleton]
import { defineStore } from 'nuxoblivius'

class Counter {
    public value: number = 0
}

export default defineStore(Counter)
```

```ts [Factory]
import { subStore } from 'nuxoblivius'

class Counter {
    public value: number = 0
}

export default () => subStore(Counter)
```
:::

В файле vue

::: code-group
```vue [Singleton]
<script setup lang="ts">
import Counter from './store/Counter'
</script>
<template>
    <button
        @click="Counter.value++"
        v-html="Counter.value"
    />
</template>
```

```vue [Factory]
<script setup lang="ts">
import useCounter from './store/Counter'
const Counter = useCounter()
</script>
<template>
    <button
        @click="Counter.value++"
        v-html="Counter.value"
    />
</template>
```
:::

## Расширяемость

Можно расширять класс, двумя методами

::: code-group
```ts [ООП]
// Base.ts ----------------------------------
export default class Base {
    public lang: string = 'ru'
}

// Articel.ts -------------------------------
import Base from './store/Base'
import { defineStore } from 'nuxoblivius'

class Article extends Base {
    public response: IArticle
}

export default defineStore(Article)
```

```ts [Компоновщик]
// Lang.ts ----------------------------------
export default class Lang {
    public lang: string = 'ru'
}

// Articel.ts -------------------------------
import Lang from './store/Lang'
import { defineStore, subStore } from 'nuxoblivius'

class Article {
    public lang = subStore(Lang)

    public response: IArticle
}

export default defineStore(Article)
```
:::

## Инкапсуляция

::: info Важно
Доступно только для примитивных объектов. Строка, число, булевое, массив, объект
:::

Есть возможность удобно сделать инкапсуляцию данных

::: code-group
```ts [Нативно]
import { defineStore } from 'nuxoblivius'

class Info {
    private _message: string = '' //Доступ только из класса
    readonly message: string      //Доступ вне класса только чтение
}

export default defineStore(Info)
```

```ts [Альтернатива]
import { defineStore } from 'nuxoblivius'

class Info {
    //Доступ только из класса
    private $message: string = ''
    // Доступ вне класса только чтение 
    get message() { return this.$message }
}

export default defineStore(Info)
```
:::

## Кастомный сеттер

Можно сделать для свойства кастомный сеттер

::: code-group
```ts [Нативно]
import { defineStore } from 'nuxoblivius'

class Date {
    private _message: string = ''
        set message(v: Date) { this._message = v.toLocaleString() }
}

export default defineStore(Info)
```
```ts [Альтернатива]
import { defineStore } from 'nuxoblivius'

class Date {
    private $message: string = ''
        set message(v: Date) { this.$message = v.toLocaleString() }
        get message(v): string { return this.$message }
}

export default defineStore(Info)
```
:::

В другом файле
```ts
import Date from './store/Date'

Date.message = new Date('2024-01-01');

console.log(Date.message) // "01.01.2024, 00:00:00"
```

## Референсы (.ref)

::: info Важно
Референсы ещё будут дорабатыватся
:::

State manager создаёт ref аттрибут для возможности работы с свойствами стора

```ts
import { defineStore } from 'nuxoblivius'

class TestStore {
    public counter: number = 0
}

export default defineStore(TestStore)
```

В другом файле

```ts
import TestStore from './store/TestStore'

// Получаем референс к свойству counter
TestStore.ref.counter

// Отслеживаем изменения у counter
TestStore.ref.counter.watch(() => {
    console.log('counter изменился')
})

TestStore.counter++
// "counter изменился"
```

## ⚡ Event: Создан

После сборки `defineStore` или `subStore` вызывается эвент `mounted`

```ts
import { defineStore } from 'nuxoblivius'

class Test {
    mounted() {
        console.log('Я собран!')
    }
}

export default defineStore(Test)
```

## API

### `defineStore`
```ts
interface Store<T> {
    ref: Record<keyof T, { value: any, watch(handle: Function): void }>
}

declare function defineStore<T extends any>(class: { new(): T }): T & Store<T>
```

### `subStore`
```ts
interface Store<T> {
    ref: Record<keyof T, { value: any, watch(handle: Function): void }>
}

declare function subStore<T extends any>(class: { new(): T }): T & Store<T>
```