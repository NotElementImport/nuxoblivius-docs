# Record (Запросы API) / Пагинация

В **Nuxoblivius** предусмотрена встроенная поддержка _пагинации_, что упрощает работу с _постраничной загрузкой данных_.

> Прежде чем приступать к настройке, рекомендуется ознакомиться с разделом про [трансформацию ответа (template)](/release/record/template), так как именно она лежит в основе обработки данных для пагинации.

## Настройка пагинации в Record

По умолчанию пагинация в **Record** отключена. Чтобы её активировать, необходимо явно указать, где именно должен передаваться номер страницы — в _query-параметре_ или в _path-параметре_.

Для этого используется **первый аргумент** метода:

> - `path:<name>` — если требуется использовать _path-параметр_ (например, `/users/page/2`).

> - `query:<name>` — если требуется использовать _query-параметр_ (например, `/users?page=2`).

::: code-group

```ts [Как path параметр] {5}
import { Record } from "nuxoblivius";

const posts = Record.new<Post>("/api/posts/{page}", []);

posts.pagination.setup("path:page");
```

```ts [Как query параметр] {5}
import { Record } from "nuxoblivius";

const posts = Record.new<Post>("/api/posts", []);

posts.pagination.setup("query:page");
```

:::

Важно: для корректной работы пагинации необходимо настроить метод `.template()`. Именно он сообщает **Record**, сколько всего _страниц доступно_, чтобы можно было переключаться между ними.

```ts {7}
import { Record } from "nuxoblivius";

const posts = Record.new<Post>("/api/posts", []);

posts.template((rawData) => ({
  data: rawData.items,
  pageCount: rawData.meta.pageCount,
}));
```

## Автоматический перезапуск запроса

При изменении параметров пагинации можно настроить автоматический повтор последнего запроса.
Для этого в **Record** используется метод `.autoReload()`, который автоматически обновляет данные при переключении страниц.

```ts {5}
import { Record } from "nuxoblivius";

const posts = Record.new<Post>("/api/posts", []);

posts.pagination.autoReload();
```

## Информация о пагинации в Record

Для работы с пагинацией **Record** предоставляет ряд _реактивных свойств_, которые позволяют отслеживать _текущее состояние_:

> - `current` — номер текущей страницы.

> - `lastPage` — номер последней доступной страницы.

> - `isLastPage` — булево значение, указывающее, является ли текущая страница последней.

Эти свойства можно использовать, например, для отображения кнопок перехода или блокировки загрузки следующей страницы.

```ts {6-8}
import { Record } from "nuxoblivius";

const posts = Record.new<Post>("/api/posts", []);

console.log(
  posts.pagination.current, // 1
  posts.pagination.lastPage, // 10
  posts.pagination.isLastPage, // false
);
```

## Управление страницей

Для удобного управления пагинацией в Record доступны как свойства, так и методы.

### Изменение текущей страницы — `current`

Вы можете напрямую изменять свойство `current`, чтобы задать номер текущей страницы.

```ts {5}
import { Record } from "nuxoblivius";

const posts = Record.new<Post>("/api/posts", []);

posts.pagination.current = 3; // Перейти на 3 страницу
```

### Методы `next()` и `prev()`

Позволяют перемещаться на следующую или предыдущую страницу.

```ts {5-6}
import { Record } from "nuxoblivius";

const posts = Record.new<Post>("/api/posts", []);

posts.pagination.next(); // Следующая страница
posts.pagination.prev(); // Предыдущая страница
```

### Методы `toFirst()` и `toLast()`

Обеспечивают быстрый переход на первую или последнюю страницу.

```ts {5-6}
import { Record } from "nuxoblivius";

const posts = Record.new<Post>("/api/posts", []);

posts.pagination.toFirst(); // Перейти на первую страницу
posts.pagination.toLast(); // Перейти на последнюю страницу
```

## Динамическое включение и выключение пагинации

Пагинацию можно гибко контролировать — при необходимости её включать или отключать.
Для этого у **Record** предусмотрено реактивное свойство `enabled`.

```ts {5}
import { Record } from "nuxoblivius";

const posts = Record.new<Post>("/api/posts", []);

posts.pagination.enabled = true;
```
