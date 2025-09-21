# Record (Запросы API) / Базовые настройки

**Record** — это встроенный класс в **Nuxoblivius**, отвечающий за работу с запросами.
Он выполняет ту же роль, что и популярные клиенты вроде **axios**, но с учётом особенностей самого фреймворка.

Вместо того чтобы быть универсальной _HTTP-библиотекой_, **Record** тесно интегрирован с архитектурой **Nuxoblivius**:

> - упрощает работу с запросами и ответами внутри приложения;

> - поддерживает собственные механизмы обработки _ошибок и статусов_;

> - позволяет использовать единый стиль взаимодействия с данными, не выходя за рамки фреймворка.

## Построение запроса

В **Nuxoblivius** запросы создаются через конструктор класса `Record.new()`.
_Метод принимает два аргумента_:

> 1. **Ссылка** — _адрес API_, по которому будет выполняться запрос.

> 2. **Значение по умолчанию** — данные, которые будут возвращены в случае _ошибки_ или при _сбросе состояния_.

Таким образом, **Record** всегда гарантирует наличие корректного значения:

> - если запрос завершился с _ошибкой_, будет подставлено **значение по умолчанию**;

> - если требуется _очистить данные_, они также сбрасываются в это значение.

```ts
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);
```

## Отправка запроса (Request)

Для выполнения _HTTP_-запросов в **Nuxoblivius** у объекта **Record** предусмотрены пять методов: `.get()`, `.post()`, `.put()`, `.delete()`, `.patch()`.

Каждый из этих методов выполняет запрос и возвращает ответ сервера (_Body Response_).

::: tip Важно
Возвращаемое значение не является реактивным — это статичный результат вызова, который можно использовать в обычной логике.
:::

::: code-group

```ts [GET] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

const response = await posts.get();
```

```ts [POST] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

const response = await posts.post();
```

```ts [PUT] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

const response = await posts.put();
```

```ts [PATCH] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

const response = await posts.patch();
```

```ts [DELETE] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

const response = await posts.delete();
```

:::

### Особенности методов

Каждый метод имеет сокращённые варианты передачи данных:

::: code-group

```ts [GET]
import { Record } from "nuxoblivius";

const post = Record.new("/api/posts/{id}", []);

// — может принимать id в качестве аргумента. Аналогично pathParam("id", value).
const response = await post.get(1);
// /api/post/1
```

```ts [POST]
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

// — принимает тело запроса. Аналогично вызову body(value).
const response = await posts.post({ message: "hello" });
```

```ts [PUT]
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

// — принимает тело запроса. Аналогично вызову body(value).
const response = await posts.put({ message: "hello" });
```

```ts [PATCH]
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

// — принимает тело запроса. Аналогично вызову body(value).
const response = await posts.patch({ message: "hello" });
```

```ts [DELETE]
import { Record } from "nuxoblivius";

const post = Record.new("/api/posts/{id}", []);

// — может принимать id в качестве аргумента. Аналогично pathParam("id", value).
const response = await post.delete(1);
// /api/post/1
```

:::

## Обработка ответа от сервера (Response)

В **Nuxoblivius** результат запроса (_Body Response_) можно обрабатывать этими способами:

> 1. **Непосредственно через возвращаемое значение функции** — когда результат запроса используется сразу в месте вызова.

> 2. **Через отдельную реактивную переменную `response`** — когда требуется сохранить результат для дальнейшей работы.

> 3. **Хук `.onFinish()`** — позволяет задать обработчик, который сработает после успешного _выполнения запроса_. [Больше информации о хуке `onFinish`](#хук-onfinish)

::: code-group

```ts [Через функцию вызова] {3}
import { Record } from "nuxoblivius";

const posts = await Record.new("/api/posts", []).get();
```

```ts [Через свойство] {7}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

await posts.get();

posts.response;
```

```ts [Через хук] {5-7}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.onFinish((posts, meta) => {
  console.log(posts);
});
```

:::

### Обработка ожидания ответа

У каждого **Record** в **Nuxoblivius** есть _реактивное свойство_ `loading`, которое отражает текущее состояние запроса:

> - `true` — запрос выполняется;

> - `false` — запрос завершён (_успешно_ или с _ошибкой_).

Это свойство удобно использовать для отображения _индикаторов загрузки_, _блокировки кнопок_ или любых других сценариев, где важно понимать, что _запрос ещё в процессе_.

```ts {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

if (posts.loading) {
  console.log("В процессе");
}
```

### Обработка ошибок

В **Nuxoblivius** ошибки можно отлавливать как во _время выполнения запроса_, так и _после него_.
Для этого предусмотрены два механизма:

> 1. **Хук `.onFailure()`** — позволяет задать обработчик, который сработает при ошибке во _время выполнения запроса_. [Больше информации о хуке `onFailure`](#хук-onfailure)

> 2. **Свойство `error`** — указывает этот запрос произошёл с ошибкой, _после выполнения запроса_.

::: code-group

```ts [Через хук] {5-9}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.onFailure((info, retry) => {
  console.error(info.response, "Ошибка");
  // Если нужно перезапустить запрос:
  return retry();
});
```

```ts [Через свойство] {7-9}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

await posts.get();

if (posts.error) {
  console.error(posts.response);
}
```

:::

### Чтение (Response Headers)

В **Nuxoblivius** прочитать заголовки ответа, можно через свойство `headers`:

```ts {6}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

// `headers` имеет тип Header
posts.headers.get("Content-Type");
```

### Сброс тела ответа

В **Record** можно одной коммандой `.clearResponse()`, выставить значение по умолчанию, для переменной `response`

```ts {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.clearResponse();
```

## Настройка Search Params (Query)

После создания объекта **Record** его можно модифицировать, добавляя _search params_ к запросу.
Для этого используется метод `.query()`.

```ts {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.query({ name: "Greatest news!" });
// /api/posts?name=Greatest news!
```

### Запекание параметров (_значения по умолчанию_)

Вторым аргументом метода `.query()` можно передать `true`.
В этом случае параметры будут "_запечены_" — то есть они сохранятся даже после очистки данных и будут использоваться по умолчанию. При необходимости их можно перезаписать новыми значениями.

::: tip Нужно помнить
Последующие перезапекание, отменяют прошлые
:::

```ts {6}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

// Указываем параметр по умолчанию
posts.query({ nsfw: "false" }, true);
// /api/posts?nsfw=false

// Перезаписываем значение
posts.query({ nsfw: "allow" });
// /api/posts?nsfw=allow
```

### Очистка параметров

Запросы поддерживают сброс динамических параметров через метод `.clearDynamicQuery()`.
_При этом_:

> - обычные параметры будут удалены,

> - "_запечённые_" параметры вернутся к своим исходным значениям.

```ts {11}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.query({ nsfw: "false" }, true);
// /api/posts?nsfw=false

posts.query({ nsfw: "allow", name: "Test 1" });
// /api/posts?nsfw=allow&name=Test 1

posts.clearDynamicQuery();
// /api/posts?nsfw=false
```

### Динамические параметры

Если данные могут изменяться, их можно указать один раз, и при каждом запросе они будут обновлятся.

::: code-group

```ts [Через функцию]
import { Record } from "nuxoblivius";

var postRating = 5;

const posts = Record.new("/api/posts", []);

posts.query({
  rating: () => postRating,
});
// /api/posts?rating=5

postRating = 4;
// /api/posts?rating=4
```

```ts [Ref объект]
import { Record } from "nuxoblivius";
import { shallowRef } from "vue";

var postRating = shallowRef(5);

const posts = Record.new("/api/posts", []);

posts.query({
  rating: postRating,
});
// /api/posts?rating=5

postRating.value = 4;
// /api/posts?rating=4
```

```ts [Reactive форма]
import { Record } from "nuxoblivius";
import { reactive } from "vue";

var postQuery = reactive({
  rating: 5,
});

const posts = Record.new("/api/posts", []);

posts.query(postQuery);
// /api/posts?rating=5

postQuery.rating = 4;
// /api/posts?rating=4
```

:::

## Настройка Path params (Динамический Path)

Помимо _query_-параметров, в **Nuxoblivius** можно использовать динамические сегменты пути (_path params_).
Это позволяет гибко подставлять значения в _URL_ без ручной конкатенации строк.

Чтобы задать динамический параметр, в шаблоне маршрута используйте фигурные скобки `{}`.
Затем подставьте значение через метод `.pathParam()`:

```ts {5}
import { Record } from "nuxoblivius";

const post = Record.new("/api/posts/{id}", {});

post.pathParam("id", 1);
// Результат: /api/posts/1
```

Таким образом, путь становится декларативным и легко расширяемым.

### Динамические параметры

Если данные могут изменяться, их можно указать один раз, и при каждом запросе они будут обновлятся.

::: code-group

```ts [Через функцию]
import { Record } from "nuxoblivius";

var postId = 1;

const post = Record.new("/api/posts/{id}", {});

post.pathParam("id", () => postId);
// /api/posts/1

postId = 2;
// /api/posts/2
```

```ts [Ref объект]
import { Record } from "nuxoblivius";
import { shallowRef } from "vue";

var postId = shallowRef(5);

const post = Record.new("/api/posts/{id}", {});

post.pathParam("id", postId);
// /api/posts/1

postId.value = 2;
// /api/posts/2
```

:::

## Настройка (Request Headers)

Для работы с заголовками в **Nuxoblivius** у объекта **Record** есть метод `.header()`.
Он позволяет задавать или изменять значения _HTTP_-заголовков для запроса.

```ts {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.header("Language", "RU");
// Результат: Language: RU
```

### Очистка заголовков

Чтобы удалить заголовок, достаточно передать `null` в качестве второго аргумента:

```ts {1}
posts.header("Language", null);
// Заголовок "Language" удалён
```

### Динамические параметры

Если данные могут изменяться, их можно указать один раз, и при каждом запросе они будут обновлятся.

::: code-group

```ts [Через функцию]
import { Record } from "nuxoblivius";

var language = "RU";

const posts = Record.new("/api/posts", []);

posts.header("Language", () => language);
// Language: RU

language = "EN";
// Language: EN
```

```ts [Ref объект]
import { Record } from "nuxoblivius";
import { shallowRef } from "vue";

var language = shallowRef("RU");

const posts = Record.new("/api/posts", []);

posts.header("Language", language);
// Language: RU

language.value = "EN";
// Language: EN
```

:::

## Настройка Тела запроса (Request Body)

Для работы с телом запроса в **Nuxoblivius** у объекта **Record** есть метод `.body()`. Он позволяет задавать или изменять тело для запроса.

::: code-group

```ts [JSON] {5-6}
import { Record } from "nuxoblivius";

const post = Record.new("/api/posts", []);

post.body({ title: "New post", content: "Some content" });
post.header("Content-Type", "application/json");
```

```ts [FormData] {5}
import { Record } from "nuxoblivius";

const post = Record.new("/api/posts", []);

post.body(new FormData());
```

:::

## Ожидать ответ типа Blob

В **Record** предусмотрен метод `.isBlob()`, который указывает, что от запроса следует ожидать ответ в формате _Blob_.
Это удобно при работе с файлами (например, изображениями, документами или бинарными данными).

::: code-group

```ts [Включить]
import { Record } from "nuxoblivius";

const file = await Record.new("/api/download", null);

file.isBlob();
```

```ts [Выключить]
import { Record } from "nuxoblivius";

const file = await Record.new("/api/download", null);

file.isBlob(false);
```

:::

## API хуков

Подробная информация о хука **Record**.

### Хук `onFinish`

В **Record** доступен хук `.onFinish()`, который позволяет выполнить дополнительную логику _после успешного завершения запроса_.

Метод принимает _функцию-обработчик_ с двумя аргументами:

> 1.  `responseBody` — тело ответа.

> 2.  `meta` — объект с дополнительной информацией:\
>     2.1 `fromCache` — показывает, были ли данные получены из кэша;\
>     2.2 `oldResponse` — предыдущее тело ответа (если оно существовало).

```ts
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.onFinish((responseBody, { fromCache, oldResponse }) => {
  console.log("Ответ:", responseBody);
  console.log("Из кэша:", fromCache);
  console.log("Предыдущий ответ:", oldResponse);
});
```

### Хук `onFailure`

В **Record** предусмотрен хук `.onFailure()`, который вызывается при возникновении _ошибки во время выполнения запроса_.

Метод принимает _функцию-обработчик_ с двумя аргументами:

> 1. `info` — объект с информацией об ошибке:\
>    1.1 `text` — текстовое описание или сообщение статуса;\
>    1.2 `code` — код ответа (например, _HTTP_-статус);\
>    1.3 `response` — тело ответа с ошибкой;\
>    1.4 `isAbort` - является ли абортом;\
>    1.5 `abortCode` - код аборта. (По умолчанию всегда -1)

> 2. `retry` — функция для повторного запуска запроса.

```ts
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.onFailure(({ text, code, response }, retry) => {
  console.error("Ошибка:", text, "Код:", code);
  console.log("Ответ:", response);

  // Пример повторного запроса
  if (code === 500) {
    return retry();
  }
});
```
