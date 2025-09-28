# Record (Запросы API) / Продвинутые настройки

В этом разделе мы разберём расширенные возможности работы с **Record**.
Если базовое использование ограничивается простыми вызовами _API_, то здесь будут рассмотрены ситуации, когда требуется **гибкая настройка поведения запросов**, а также оптимизация под конкретные сценарии.

## Ограничение запроса, одним активным

Метод `.oneRequestAtTime()` ограничивает выполнение только одним активным запросом одновременно.

> - Если запрос уже выполняется, повторный вызов не запускает новый, а _возвращает ссылку на текущий_.

> - Это помогает избежать "_дублирующих_" запросов при быстрых кликах или множественных обновлениях состояния.

::: code-group

```ts [Включить] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.oneRequestAtTime();
```

```ts [Выключить] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.oneRequestAtTime(false);
```

:::

Таким образом, вы гарантируете, что в каждый момент времени _выполняется ровно один запрос_.

## Отправлять запрос, только если нет данных

_Особенности_: <Badge type="tip" text="Не поддерживает SSR" />

Метод `.onlyOnEmpty()` разрешает выполнять запрос только в том случае, если у текущего **Record** _ещё нет данных_.

> - Если данные уже загружены, новый вызов запроса _проигнорируется_.

> - Особенно полезно для _кэшированных или одноразовых запросов_, когда нет необходимости повторно обращаться к серверу.

::: code-group

```ts [Включить] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.onlyOnEmpty();
```

```ts [Выключить] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.onlyOnEmpty(false);
```

:::

Такой подход снижает нагрузку на сервер и ускоряет работу приложения за счёт повторного использования уже полученных данных.

## Регулирование отчистки данных, во время запроса

Метод `.swapMethod()` управляет тем, когда [**реактивный** `response`](/release/record/base#обработка-ответа-от-сервера-response) должен обновляться в _процессе выполнения запроса_.

**Доступные режимы**:

> - `greedy` — [**реактивный** `response`](/release/record/base#обработка-ответа-от-сервера-response) обновляется сразу после _отправки запроса_.
>   Полезно, если нужно мгновенно показать состояние (например, сбросить список при фильтрации).

> - `lazy` — используется для работы с дополнительными модулями (_кэширование_, _взаимствование_).
>   Работает как `greedy`, но если ни один модуль не предоставит данные, [`response`](/release/record/base#обработка-ответа-от-сервера-response) откатывается к значению по умолчанию.

> - `hot` — [**реактивный** `response`](/release/record/base#обработка-ответа-от-сервера-response) обновляется только после _завершения запроса_.
>   Это стандартное и безопасное поведение: данные меняются, только когда есть результат.

::: code-group

```ts [Hot] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.swapMethod("hot");
```

```ts [Lazy] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.swapMethod("lazy");
```

```ts [Greedy] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.swapMethod("greedy");
```

:::

Таким образом, можно гибко контролировать момент подмены реактивных данных в зависимости от сценария.

## Конкатенация данных

Метод `.appendsResponse()` позволяет управлять тем, как будут обновляться данные, если ответ от сервера имеет _формат массива_.

> - По умолчанию новые данные заменяют текущий массив.

> - Если включить `.appendsResponse()`, новые данные будут добавляться в конец списка.

Это особенно удобно для реализации постраничной подгрузки (_infinite scroll_).

::: code-group

```ts [Включить] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.appendsResponse();
```

```ts [Выключить] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.appendsResponse(false);
```

Таким образом, **Record** можно использовать как основу для бесконечной ленты данных.

:::

## Динамическая перезагрузка данных

_Особенности_: <Badge type="tip" text="Не поддерживает SSR" />

Метод `.reloadBy()` позволяет автоматически перезапускать запрос при изменении указанной **реактивной переменной**.

Это удобно, когда данные напрямую зависят от _состояния интерфейса_ или _параметров фильтрации_.

::: code-group

```ts [Глобально] {8}
import { Record } from "nuxoblivius";
import { shallowRef } from "vue";

const someFilter = shallowRef("value");

const posts = Record.new("/api/posts", []);

posts.reloadBy(someFilter, { componentScope: false });
```

```ts [В контексте компоненты] {8,10}
import { Record } from "nuxoblivius";
import { shallowRef } from "vue";

const someFilter = shallowRef("value");

const posts = Record.new("/api/posts", []);

posts.reloadBy(someFilter);
// или
posts.reloadBy(someFilter, { componentScope: true });
```

```ts [С возможностью контроля] {8,9}
import { Record } from "nuxoblivius";
import { shallowRef } from "vue";

const someFilter = shallowRef("value");

const posts = Record.new("/api/posts", []);

const cancelAutoReload = posts.reloadByControlled(someFilter);
cancelAutoReload();
```

:::

Таким образом, **Record** всегда будет содержать актуальные данные в зависимости от значения **реактивной переменной**.

## Авторизация

Метод `.auth()` задаёт заголовок **Authorization** для текущего **Record**.
Используется для работы с _API_, которые требуют авторизацию.

Кроме того, в **Record** предусмотрены статические методы для удобной генерации стандартных схем:

> - `Record.Basic(login, password)` — создаёт заголовок _Basic_ ...

> - `Record.Bearer(token)` — создаёт заголовок _Bearer_ ...

::: code-group

```ts [Bearer] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.auth(Record.Bearer("some_token_value"));
```

```ts [Basic] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.auth(Record.Basic("login", "password"));
```

```ts [Отключить] {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.auth(null);
```

:::

Таким образом, можно быстро подключать разные схемы авторизации без ручной сборки строки.

### Глобальный хук `SetDefaultAuth()`

Метод `SetDefaultAuth()`, позволяет глобально всем **Record**, задать заголовок **Authorization**.

::: code-group

```ts [Обычно]
import { SetDefaultAuth } from "nuxoblivius";

SetDefaultAuth("some_auth_data");
```

```ts [Динамический параметр]
import { SetDefaultAuth } from "nuxoblivius";

SetDefaultAuth(() => "some_auth_data");
```

:::

## Общий сброс данных

Метод `.reset()` позволяет одной командой сбросить состояние **Record** частично или полностью.
Это упрощает управление жизненным циклом данных, особенно при работе с фильтрами, пагинацией и динамическими параметрами.

Параметры _config_:

> - `pagination: boolean` — сброс пагинации к начальному состоянию.

> - `response: boolean` — очистка текущего ответа и возврат к значению по умолчанию.

> - `query: boolean` — очистка динамических query-параметров (аналог метода .clearDynamicQuery()).

По умолчанию все параметры установлены в `false`.

```ts {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.reset({ pagination: true, response: true, query: true });
```

Таким образом, `.reset()` позволяет гибко контролировать и обнулять нужные части состояния **Record**.

## Отмена запроса <badge text="^1.7.17" />

Иногда возникает необходимость прервать запрос:
например, при уходе пользователя со страницы, переключении вкладок, который делает старый запрос неактуальным.

В **Nuxoblivius** для этого предусмотрены методы:

### `.abortRequests(abortCode)`

Отменяет текущие запросы у конкретного **Record**.

В обработчик [`.onFailure()`](/release/record/base.html#хук-onfailure) дополнительно передаётся информация:

> - что ошибка вызвана именно абортом;

> - код аборта (_abortCode_) для идентификации причины.

```ts {5}
import { Record } from "nuxoblivius";

const posts = Record.new("/api/posts", []);

posts.abortRequests(401);
```

### `tryAbortAllRequest(abortCode)`

Отменяет все активные запросы у всех **Record** одновременно.

Полезно, если нужно быстро остановить все фоновые операции, например при глобальном _logout_.

```ts {3}
import { tryAbortAllRequest } from "nuxoblivius";

tryAbortAllRequest(401);
```

Таким образом, система абортов помогает гибко контролировать запросы и предотвращать гонки данных.
