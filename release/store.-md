# Store

`Store` использует классовую систему ООП.

Для определения хранилища в виде `Singleton`-а используется функция `defineStore()`
```ts
import {defineStore} from 'nuxoblivius'

class Example {
    public field: number = 0
}

// Singletone style (And Cached)
export default defineStore<Example>(Example)
```

Для определения хранилища в виде `Фабрики` используется функция `subStore()`
```ts
import {subStore} from 'nuxoblivius'

class Example {
    public field: number = 0
}

// Factory style
export default () => subStore<Example>(Example)
```
