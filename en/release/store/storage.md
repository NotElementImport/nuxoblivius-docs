# Store - Storage

[Storage](/release/storage) is independent object, who had can keep data in page, and work again later. Work like as `Prop`


Definition in store (Client keep data):
```ts
import {defineStore, Storage} from 'nuxoblivius'

class Example {
    public myVar = Storage.client<string>('my-name', 'default-value')
}

export default defineStore<Example>(Example)
```

Definition in store (Server keep data, cookie) (Nuxt 3: Had bugs):
```ts
import {defineStore, Storage} from 'nuxoblivius'

class Example {
    public myVar = Storage.server<string>('my-name', 'default-value')
}

export default defineStore<Example>(Example)
```