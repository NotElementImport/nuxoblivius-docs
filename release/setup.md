# Setup

Установка:

```shell
npm i nuxoblivius@latest
```

Для избежания некоторых ошибок типизации (например, в инкапсулируемых данных) прописать в  `tsconfig.json`:
```json
{
    "compilerOptions": {
        "strictNullChecks": false
    }
}
```

В Nuxt 3 добавить в `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
    ...
    modules: [
        'nuxoblivius/nuxt',
    ],

    nuxoblivius: {
        // SSR need
        // Path to API (For Records)
        api: "http://my-api.com" // Without `/` at end
    },
    ...
})
```