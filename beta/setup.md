# Установка

Установка производится командой:

```shell
npm i nuxoblivius@0.4.2-b #stable
```

Поддерживаются `Vue 3` и `Nuxt 3`.

При использовании на `Nuxt 3` необходимы следующие настройки в файле `nuxoblivius.ts` папки `plugins`:

```ts
import {
  setCustomCookie,
  setCustomRouter,
  setCustomFetch,
  setHeaders,
} from "nuxoblivius";

export default defineNuxtPlugin((nuxtApp) => {
  setCustomCookie(useCookie); // Регистрируем Cookie на сервере
  setCustomRouter(useRouter); // Регистрируем Router проекта на сервере
  setCustomFetch(useLazyFetch); // Регистрируем Кастомный Fetch проекта на сервере
  setHeaders(useRequestHeaders()); // Передаём header-ы
});
```

## createCustomTemplate

Дополнительно можно использовать функцию `createCustomTemplate`, содержащей логику форматирования приходящих с backend-а данных. Её работу проще будет продемонстрировать на примере:

```ts
import {
  setCustomCookie,
  setCustomRouter,
  setCustomFetch,
  setHeaders,
} from "nuxoblivius";

export default defineNuxtPlugin((nuxtApp) => {
  setCustomCookie(useCookie); // Регистрируем Cookie на сервере
  setCustomRouter(useRouter); // Регистрируем Router проекта на сервере
  setCustomFetch(useLazyFetch); // Регистрируем Кастомный Fetch проекта на сервере
  setHeaders(useRequestHeaders()); // Передаём header-ы
  createCustomTemplate(
    "my-template",
    (data: Record<string, unknown>) => {
      // 1-й аргумент - название templat-а
      if ("data" in data) {
        // из приходящего "сырого" объекта данных с backend-а берём объект data
        return {
          data: data.data.map((el) => {
            return el.attributes;
          }), // а из объекта data, в свою очередь, объект attributes
          pageCount: data.meta.pagination.total_pages,
        }; // а также, при наличии мета-данных о пагинации, сохраняем количество страничек
      } else return undefined;
    },
    (query, path, current_page, size) => {
      // логика пагинации
      query.set({
        page: current_page,
      });
    },
  );
});
```

Данный шаблон преобразовывает такие данные:

```json
{
  "data": [
    {
      "id": 0,
      "title": "New news article"
    },
    {
      "id": 1,
      "title": "New a new news article!"
    }
  ],
  "meta": {
    "total-count": 5,
    "page-count": 1,
    "current-page": 1,
    "per-page": 20
  }
}
```

В следующий вид:

```json
[
  {
    "id": 0,
    "title": "New news article"
  },
  {
    "id": 1,
    "title": "New a new news article!"
  }
]
```

, а также сохраняя логику пагинации, которые сможет учитывать метод [pagination](/beta/store/methods.html#pagination-size-number-append-boolean)
