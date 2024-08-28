# Setup

Install to a project

```shell
npm i nuxoblivius@latest
```

And write rule to `tsconfig.json` (for work encapsulation, and read only)
```json
{
    "compilerOptions": {
        "strictNullChecks": false
    }
}
```

In Nuxt 3. Add module and params

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