# Store

`Store` using OOP class system

To define `Store` as Singletone, use function `defineStore()`
```ts
import {defineStore} from 'nuxoblivius'

class Example {
    public field: number = 0
}

// Singletone style (And Cached)
export default defineStore<Example>(Example)
```

To define `Store` as Factory, use function `subStore()`
```ts
import {subStore} from 'nuxoblivius'

class Example {
    public field: number = 0
}

// Uses in specific moments
// Factory style
export default () => subStore<Example>(Example)
```