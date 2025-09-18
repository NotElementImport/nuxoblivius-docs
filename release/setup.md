# Установка

Вся необходимая информация, что бы установить **Nuxoblivius**

## Минимальные требования для проекта

- `vue` - `^3.1`
- `typescript` - `^5.1`

## Установка пакета

Установить **Nuxoblivius** изспользуя комманду

<section style="padding: 1em; padding-bottom: 0.1em; background: var(--vp-c-bg-elv); border-radius: 12px;">
  <div>
    <span style="color: var(--vp-c-text-2); display: block; margin-bottom: -8px; font-size: 16px; font-weight: 500; text-transform: uppercase;">
      npm:
    </span>

```shell
npm i nuxoblivius@latest
```

  </div>

  <div>
    <span style="color: var(--vp-c-text-2); display: block; margin-bottom: -8px; margin-top: 1em; font-size: 16px; font-weight: 500; text-transform: uppercase;">
      pnpm:
    </span>

```shell
pnpm i nuxoblivius@latest
```

  </div>

  <div>
    <span style="color: var(--vp-c-text-2); display: block; margin-bottom: -8px; margin-top: 1em; font-size: 16px; font-weight: 500; text-transform: uppercase;">
      yarn:
    </span>

```shell
yarn add nuxoblivius@latest
```

  </div>
</section>

## Рекомендации

### Если ругается компилятор <Badge type="warning" text="Не рекомендуется" />

> Для избежания некоторых ошибок типизации (например, в инкапсулируемых данных) прописать в `tsconfig.json`:
>
> ```json
> {
>   "compilerOptions": {
>     "strictNullChecks": false
>   }
> }
> ```
