# Установка

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