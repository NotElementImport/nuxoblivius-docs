# Record (Fetch)

`Record` (запись) - fetch-клиент, предлагающий множество полезных функций и свойств для удобства работы с данными.

## Определение
`Record` определяется функцией `new('path-to-api', init)`:

::: code-group
```ts [Нативно]
import { Record } from 'nuxoblivius'

const testRecord = Record.new<IResponseType>('/api/test')
```
```ts{4} [В State Manager (-е)]
import { defineStore, Record } from 'nuxoblivius'

class Test {
    public test = Record.new<IResponseType>('/api/test')
}

export default defineStore(Test)
```
```ts{5} [В Pinia🍍]
import { defineStore } from 'pinia'
import { Record } from 'nuxoblivius'

export default defineStore('test', () => {
    const test = Record.new<IResponseType>('/api/test')

    return { test }
})
```
:::
, принимающей 1-м аргументом путь к api; 2-м аргументом (по желанию) - значение для инициализации (по умолчанию - null).

Как видно, `Record` доступен к использованию не только в рамках `Nuxoblivius`, но и вне него, в т.ч. реализована поддержка `Pinia`.

## Обработка запросов

Для осуществления самих запросов к API `Record` предлагает функции `get()`, `post()`, `put()`, `delete()`, `patch()`.
Все 4 функции возвращают Promise со значением с API. Отметим сразу, что данное возвращаемое значение не будет реактивным. Реактивное значение доступно из [ref](/release/state-manager.html#референсы-ref), либо из свойства [response](/release/record.html#реактивныи-response).

::: code-group
```ts{5} [GET]
import { Record } from 'nuxoblivius'

const testRecord = Record.new<IResponseType>('/api/test')

// Использование:
testRecord.get()
    .then(e => console.log(e))
// или:
record.get(1) // с аргументом
// или:
record.get('1') // с аргументом

// метод может принимать аргумент id (число),
// которое отработает как: pathParam('id', ваше значение) 
// Если не выставить значение, pathParam будет стёрт.
```
```ts{5} [POST]
import { Record } from 'nuxoblivius'

const testRecord = Record.new<IResponseType>('/api/test')

testRecord.post()
    .then(e => console.log(e))

// метод может принимать аргумент body - объект (для JSON) или FormData.

// JSON:
record.post({'my': 'json'})

// или FormData:
const formData = new FormData()
formData.append('my', 'formData')
record.post(formData)
```
```ts{5} [PUT]
import { Record } from 'nuxoblivius'

const testRecord = Record.new<IResponseType>('/api/test')

testRecord.put()
    .then(e => console.log(e))

// метод может принимать аргумент body - объект (для JSON) или FormData.

// JSON:
record.put({'my': 'json'})

// или FormData:
const formData = new FormData()
formData.append('my', 'formData')
record.put(formData)
```
```ts{5} [PATCH]
import { Record } from 'nuxoblivius'

const testRecord = Record.new<IResponseType>('/api/test')

testRecord.patch()
    .then(e => console.log(e))

// метод может принимать аргумент body - объект (для JSON) или FormData.

// JSON:
record.patch({'my': 'json'})

// или FormData:
const formData = new FormData()
formData.append('my', 'formData')
record.patch(formData)
```
```ts{5} [DELETE]
import { Record } from 'nuxoblivius'

const testRecord = Record.new<IResponseType>('/api/test')

// Использование:
testRecord.delete()
    .then(e => console.log(e))
// или:
record.delete(1) // с аргументом
// или:
record.delete('1') // с аргументом

// метод может принимать аргумент id (число),
// которое отработает как: pathParam('id', ваше значение) 
// Если не выставить значение, pathParam будет стёрт.
```
:::

## Реактивный Response

Реактивный Response (последнее полученное с api значение) всегда доступен к прочтению:

::: code-group
```vue{10} [CSR]
<script setup lang="ts">
import { Record } from 'nuxoblivius'

const posts = Record.new<IResponseType>('/api/posts')

posts.get()
</script>
<template>
    <!-- Реактивный Response, SSR-friendly: -->
    <pre> {{ posts.response }} </pre>
</template>
```
```vue{11} [SSR]
<script setup lang="ts">
import { Record } from 'nuxoblivius'

const posts = Record.new<IResponseType>('/api/posts')

// await - для корректного SSR
await posts.get()
</script>
<template>
    <!-- Реактивный Response, SSR-friendly: -->
    <pre> {{ posts.response }} </pre>
</template>
```
```vue{15} [Lazy SSR]
<script setup lang="ts">
import { Record, useLazySpread } from 'nuxoblivius'

const posts = Record.new<IResponseType>('/api/posts')

// Хук useLazySpread не будет задерживать отрисовку на клиенте
// , а также позволяет осуществлять одновременно
// несколько запросов без задержек
await useLazySpread([
    () => posts.get()
]) 
</script>
<template>
    <!-- Реактивный Response, SSR-friendly: -->
    <pre> {{ posts.response }} </pre>
</template>
```
:::

## Обработка ошибок

Доступен инструментарий для обработки ошибок:

::: code-group
```ts{7-10} [Через свойство]
myStore.record.get()

if(myStore.record.error) // true или false
    console.log('Что-то пошло не так: ', myStore.record.errorText) // текст ошибки
```
```ts{4} [Через функцию]
// User.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public users = Record.new<IUser[]>('/api/users')
        .onFailure((reason, retry) => {
            console.log(reason)
        })
}

export default defineStore<User>(User)
```
:::
В функции `onFailure`:
* `reason` - объект, состоящий из двух ключей: `text` (содержащий errorText запроса) и `code` (код ошибки).
* `retry` - функция запроса, вызвавшего ошибку. При желании можно осуществить этот запрос заново.

Функцию для обработки ошибок можно определить и [глобально](/release/global-functions.html#onrecordfetchfailed) для всех запросов каждого Record-а.

## Обработка ожидания ответа

Доступно реактивное булевое свойство, показывающее, идёт ли загрузка с API в данный момент:

```vue{10,11}
<script setup lang="ts">
import { Record } from 'nuxoblivius'

const posts = Record.new<IResponseType>('/api/posts')

posts.get()
</script>
<template>
    <section>
        <pre v-show=" posts.loading"> Loading... </pre>
        <pre v-show="!posts.loading"> {{ posts.response }} </pre>
    </section>
</template>
```

## Обработка заголовков ответа (Response Headers)

Доступны к прочтению заголовки ответа:

```ts
import { Record } from 'nuxoblivius'

const posts = Record.new<IResponseType>('/api/posts')

await posts.get()

console.log(
    // Response headers
    posts.headers.get('Content-Type')
)
// application/json
```

## Конфигурация запроса

Recod предоставляет многофункциональный builder для запросов.

### Query-параметры к API

Можно приложить к запросу объект с query-параметрами в аргументе к функции `query()`:

```ts {11-18}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

let myParam = 0

class UserInfo {
    public myValue: number = 0

    public getUserInfo = Record.new<IUserInfo>('/api/user/info')
        .query({
            param: 'value', // статические параметры
            group: {
                param: 'value'
            },
            reactiveParam: this.ref.myValue, // динамический параметр, будет изменяться при изменении myValue
            reactiveParamAlt: () => myParam // также динамический параметр, но записанный иначе
        })
}

export default defineStore<UserInfo>(UserInfo)
```

Параметры могут быть как статическими, так и динамическими.
Динамические параметры могут быть записаны двумя способами, подробнее: [Динамические параметры](/release/records.html#динамические-параметры)

Также возможность 'запечь' некоторые значения: их можно будет перезаписать, но невозможно будет удалить:

```ts
const posts = Record.new<IResponseType>('/api/posts')
    .query({ name: 'Post number 1' }) // [!code --]
    .query({ name: 'Post number 1' }, true) // [!code ++] Запекаем

// Result: /api/posts?name=Post number 1

posts.query({ name: "Other" })

// Result: /api/posts?name=Other

posts.clearDynamicQuery()

// Result: /api/posts?name=Post number 1
```

Чтобы при каждом изменении query-параметра запрос осуществлялся заново, можно использовать функцию `reloadBy`:

### ReloadBy <Badge type="tip" text="Работает только на клиенте" />

```ts {12}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

// при каждом изменении значения myValue запрос будет осуществляться заново
let myParam = ref(myValue)

Record.new<IUserInfo>('/api/user/info')
    .query({
        'my-param': () => myParam.value
    })
    .reloadBy(myParam)
```

Есть функция для очистки query-параметров `Record`-а:

```ts
myRecordObject.clearDynamicQuery() // удаляет всё, кроме запечённых значений
```

Можно передать все пары "ключ-значение" из Sub Stor-а в качестве query-параметров: [Query-параметры из Sub Store](/release/sub-store.html#query-параметры-из-sub-store)

Демо:

<section class="tabs">
  <input type="checkbox" id="uidau"/>
  <label class="tabs-swap" for="uidau"/>
  <section class="tabs-render">
    <section class="render-tools">
        <button @click="e => posts.get()">
            🔍
        </button>
        <input
            type="search"
            v-model.lazy="q"
            style="flex: 1 1;"
            placeholder="Поиск..."
        />
    </section>
    <section :class="['render-list', posts.loading && 'loading']" style="min-height: 392px;">
        <article class="render-block" v-for="item in posts.response">
            <section class="main limit-text-2">
                {{ item.title }}
            </section>
            <section class="sub limit-text-2">
                {{ item.body }}
            </section>
        </article>
    </section>
    <a style="margin-top: 0.5em; display: inline-block; opacity: 0.5;" href="https://dummyjson.com/"> Posts by: DummyJSON </a>
  </section>
  <section class="tabs-source">

```vue
<script setup lang="ts">
import { Record } from 'nuxoblivius'
import { ref } from 'vue'

const q = ref('')

const posts = Record.new<IResponseType>('https://dummyjson.com/posts/search')
    .oneRequestAtTime()
    .query({ q, limit: 3 })
    .reloadBy(q)

posts.get()
</script>
<template>
    <SearchToolbar v-model="q"/>
    <section :class="['list', posts.loading && 'list-loading']">
        <article clas="article" v-for="post in posts.response">
            <div class="title"> {{ post.title }} </div>
            <div class="body">  {{ post.body }} </div>
        </article>
    </section>
</template>
```

  </section>
</section>

### Path-параметры

`Record` поддерживает путь к api вида `/api/user/get/{id}`

Пример:
```ts {9,12,15}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public idUser: number = 0

    public getUserById = Record.new<IUser>('/api/user/get/{id}')
        .pathParam('id', this.idUser) // в качестве id к ссылке будет дописан this.ref.idUser

    public getUserById = Record.new<IUser>('/api/user/get/{id}')
        .pathParam('id', this.ref.idUser) // динамическое значение

    public getUserBySlug = Record.new<IUser>('/api/user/get/{slug}')
        .pathParam('slug', null) // если прокинут null - значение не дописывается
}

export default defineStore<User>(User)
```
Можно "прокинуть" параметр и при использовании в рамках одной компоненты:

```ts
User.getUser.pathParam("slug", 'ivan').get()
```

Также доступен объект `params`, содержащий текущие параметры (`path` и `query`):
```ts
console.log(User.params.path.slug) // 'ivan'
```

### Body Request

Можно прописать тело запроса в виде объекта (который сконвертируется в JSON) либо FormData в аргументе функции `body()`:

```ts{8,10}
// User.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public getUser = Record.new<IUser>('/api/user/get/{id}')
        // Object for JSON:
        .body({ myData: true })
        // or FormData:
        .body(new FormData(...))
}

export default defineStore<User>(User)
```

### Headers

`Record` позволяет прописывать к запросам заголовки:

Пример:
```ts {9,12,15}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public contentType: string = 'application/json'

    public getUser = Record.new<IUser>('/api/user/get/{id}')
        .header('Content-Type', 'application/json')

    public getUserDynamic = Record.new<IUser>('/api/user/get/{id}')
        .header('Content-Type', this.ref.contentType) // динамический параметр
    // или:
    public getUserDynamic = Record.new<IUser>('/api/user/get/{id}')
        .header('Content-Type', () => this.contentType) // динамический параметр
}

export default defineStore<User>(User)
```

### Blob Response

Доступна функция `isBlob()` для работы с Blob-ами, получаемыми с API:

Пример использования:
```ts {3}
// определяем record:
const record = Record.new<Blob>('url-to-get-blob')
    .isBlob(true)
    .defineProtocol('total', 0)
    .onFailure(Auth.failureHandle())

// используем его и получаем данные:
const result = await record
    .query(queryOfRequest)
    .get()

console.log(result); // на выходе - Blob
```

<script setup>
import { ref } from 'vue'
import { Record } from 'nuxoblivius'

const q = ref('')

const posts = Record.new('https://dummyjson.com/posts/search')
    .pagination.setup('path:null')
    .pagination.autoReload()
    .oneRequestAtTime()
    .template(raw => ({ data: raw.posts, pageCount: ~~(raw.total * (1 / 3)) }))
    .swapMethod('lazy')
    .createTag('query:q', 'full')
    .createTag('path:null', 'full')
    .rule({ 'q': '<>' }, $ => $.reset({ pagination: true }))
    .rule({ null: '*' }, $ => {
        $.onlyOnEmpty().response = posts.cached({ 'null': posts.pagination.current }) ?? $.onlyOnEmpty(false).response
    })
    .query({ q, limit: 3, select: "title,body", skip: () => ((posts.pagination.current - 1) * 3) }, true)
    .reloadBy(q)

posts.get()
</script>

## Пагинация

⚠ Для пагинации обязательно нужно использовать [#шаблоны](/release/record.md#шаблоны-pattern-response-reader) ⚠

Имеется инструментарий для удобной работы с пагинацией.

```ts{7-9}
// User.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public users = Record.new<IUser[]>('/api/users')
        .pagination.setup('query:page') // Инициализация пагинации. Объявление параметра. Перед двоеточием: 'path'|'query'. После двоеточия: значение параметра
        .pagination.autoReload() // автоматическая подгрузка новых страничек
        .appendsResponse() // суммирование страничек
}

export default defineStore<User>(User)
```
`Record` предоставляет объект `pagination`, содержащий ряд функций и свойств:
* `setup(path:id|query:page)` - инициализация пагинации. В аргументе ожидается строка:
    + либо `query:${page}`, если переключение между страницами осуществляется по изменениям query-параметра. После двоеточия - название query-параметра.
    + либо `path:${id}`, если переключение осуществляется по изменениям [path-параметра](/release/record.html#path-параметры) (после `/` ). После двоеточия - название path-параметра.
* `current` - текущая страница пагинации
* `lastPage` - номер последней страницы (определяется из meta-данных ответов через параметр `pageCount` в настройках [template](/release/records-caching.html))
* `isLastPage` - является ли текущая страница последней (true/false)
* `autoReload()` - автоматическая подгрузка новых данных при изменении номера страницы. Если не объявить - автоподгрузку нужно будет осуществлять вручную (например, используя [reloadBy](/release/record.html#reloadby)).
* `next()` - увеличение текущей страницы на 1 (если текущая страница не является последней)
* `prev()` - уменьшение текущей страницы на 1 (если текущая страница не является первой)
* `toFirst()` - перемещение к первой странице
* `toLast()` - перемещение к последней странице

Если в response необходимо суммировать (а не перезаписывать) страницы - можно использовать функцию [appendsResponse](/release/record.html#appendsresponse) над `Record`.

#### Пагинация демо (+ кэширование)

<br>

<section class="tabs">
  <input type="checkbox" id="uid1"/>
  <label class="tabs-swap" for="uid1"/>
  <section class="tabs-render">
    <section :class="['render-list', posts.loading && 'loading']" style="min-height: 392px;">
        <article class="render-block" v-for="item in posts.response">
            <section class="main limit-text-2">
                {{ item.title }}
            </section>
            <section class="sub limit-text-2">
                {{ item.body }}
            </section>
        </article>
    </section>
    <section :class="['render-footer', posts.loading && 'loading']">
      <button 
        @click="posts.pagination.toFirst()"
        v-show="!posts.pagination.current != 1">
        Первая стр.
      </button>
      <button 
        @click="posts.pagination.prev()"
        v-show="posts.pagination.current != 1">
        Пред.
      </button>
      <button 
        @click="posts.pagination.next()"
        v-show="!posts.pagination.isLastPage">
        След.
      </button>
      <button 
        @click="posts.pagination.toLast()"
        v-show="!posts.pagination.isLastPage">
        Посл. стр.
      </button>
      <span style="margin-left: auto;">
        {{ `${posts.pagination.current}/${posts.pagination.lastPage}` }}
      </span>
    </section>
    <a style="margin-top: 0.5em; display: inline-block; opacity: 0.5;" href="https://dummyjson.com/"> Posts by: DummyJSON </a>
  </section>
  <section class="tabs-source">

```vue
<script setup lang="ts">
import { Record } from 'nuxoblivius'
import { useCached } from 'nuxoblivius/presets'

const posts = Record.new<IResponseType>('https://dummyjson.com/posts')
    // Пагинация
    .pagination.setup('query:page')
    .pagination.autoReload()
    .template(raw => ({ data: raw.posts, pageCount: raw.total }))
    .query({ limit: 3 })
    // Кэширование
    .preset(useCached(['query:page']))

posts.get()
</script>
<template>
    <section :class="['list', posts.loading && 'loading']">
        <Article v-for="post in posts.response" :post="post" />
    </section>
    <section :class="['pagination', posts.loading && 'loading']">
        <UXButton
            v-show="posts.pagination.current != 1"
            caption="Первая стр."
            @click="posts.pagination.prev()"/>
        <UXButton
            v-show="posts.pagination.current != 1"
            caption="Пред."
            @click="posts.pagination.prev()"/>
        <UXButton
            v-show="!posts.pagination.isLastPage"
            caption="След."
            @click="posts.pagination.next()"/>
        <UXButton
            v-show="!posts.pagination.isLastPage"
            caption="Посл. стр."
            @click="posts.pagination.toLast()"/>
        <PagInfo 
            :current="posts.pagination.current"
            :count="posts.pagination.lastPage"/>
    </section>
</template>
```

  </section>
</section>

## appendsResponse

Функция, используя которую, при многократных запросах одного `Record`-а к API все [Response](/release/record.html#реактивныи-response)-ы будут суммироваться в один. Может быть полезным для [пагинации](/release/record.html#пагинация).

```ts{8}
// User.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public users = Record.new<IUser[]>('/api/users')
        .pagination.setup('query:page') // инициализация пагинации
        .appendsResponse() // суммирование страничек
}

export default defineStore<User>(User)
```

### onFinish

Функция, позволяющая после завершения запроса к API выполнить определенные действия.

```ts{7}
// User.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public users = Record.new<IUser[]>('/api/users')
        .onFinish((result) => {
            console.log(result)
        })
}

export default defineStore<User>(User)
```
* `result` - ответ с api.

### then

Функция, позволяющая выполнить определенные действия после выполнения любой другой функции `Record`-а.

После функций, возвращающих Promise, можно использовать и стандартный `then` из JavaScript, однако предоставляемую `Record`-ом функцию можно использовать и в таких случаях, как:

```ts
record.pagination.next().then(_ => {console.log('Подгрузили следующую страницу')}) // после функций пагинации
record.clearResponse().then(_ => {console.log('Response был очищен')}) // после функции очистки Respons-а
```

### onlyOnEmpty

Функция, благодаря которой запросы к API для одного `Record`-а не будут повторяться в рамках сессии (например, при открытии пользователем одной и той же страницы повторно).

```ts{7}
// User.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public users = Record.new<IUser[]>('/api/users')
        .onlyOnEmpty() // глобальное выставление опции
}

export default defineStore<User>(User)
```
Или:
```ts
User.users.onlyOnEmpty().get() // использование опции в рамках только одного компонента
```

Функция проигнорируется при активной пагинации (чтобы не препятствовать получению новых страничек).

## Авторизация

`Record` позволяет добавлять заголовок авторизации:

```ts{7}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public getUser = Record.new<IUser>('/api/user/get/{id}')
        .auth('Bearer as|asd%120_xcas1oa7x6')
}

export default defineStore<User>(User)
```

Либо - в качестве синтаксического сахара предоставлена возможность указывать данные авторизации через функции `Bearer` либо `Basic`:

```ts{7,9,15,17}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public getUser = Record.new<IUser>('/api/user/get/{id}')
        .auth(Record.Bearer('as|asd%120_xcas1oa7x6'))
        // или:
        .auth(Record.Basic('login', 'password'))

    // динамический параметр
    public token: string = 'mkj#jgkdfgm*ew'
    
    public getUserDynamic = Record.new<IUser>('/api/user/get/{id}')
        .auth(Record.Bearer(() => this.token))
        // или:
        .auth(Record.Bearer(this.ref.token))
}

export default defineStore<User>(User)
```

## borrowFrom

Функция, позволяющая одному `Record`-у брать данные из другого `Record`-а (при наличии там).

Пример:

```ts{4-16}
public items = Record.new<ICabinet[]>('/api/items', [])

public item = Record.new<ICabinet>('/api/item/{id}', {})
    .borrowFrom(
        {id: '*'} // значит, осуществляем взятие при любых id из path-параметра
        // или: {id: 5} // значит, осуществляем взятие только при id, равном 5
        // или: (method) => method.path.id != null, // значит, "взятие" будет осуществляться для любых id, не равных null
        // или: (method) => method.path.id == 5, // "взятие" будет осуществляться только при id, равном 5

        () => { return this.items.response }, // возвращаемое значение - массив, из которого будут браться данные
        (other) => { // other - фактически, тот самый массив с предыдущей функции
            // берём данные из other в случае совпадения по id. Id текущего элемента можно взять из params (см. #Path-параметры)
            if(other.id == this.item.params.path.id) // можно прописать и любое другое условие для взятия
                {return other}
        }
    )
```
Подытоживая - `borrowFrom` принимает в аргументе 3 функции:
1. Функция-условие, при каких path-параметрах осуществлять взятие
2. Функция-возврат массива, из которого берём данные (который может быть и вне какого-либо `Record`-а)
3. Функция, содержащая условие для взятия данных из массива (например, при совпадении id)

## clearResponse

Функция, очищающая [Response](/release/records.html#response) (можно изменять response и напрямую, но не рекомендуется).

```ts{10}
// User.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public getUser = Record.new<IUser>('/api/user/get/{id}')
        .auth('Bearer as|asd%120_xcas1oa7x6')

    public function Clear() {
        this.getUser.clearResponse() // очистит response
    }
}

export default defineStore<User>(User)
```

## swapMethod

Функция, с помощью которой можно указать, каким образом будут "перезаписываться" данные в `Response` при повторных запросах (например, при изменениях path-param, либо при пагинации):
* `hot` (по умолчанию): только после завершения подгрузки новых данных
* `greedy`: при запуске нового запроса response очищается; по завершению - перезаписывается.

Пример использования:
```ts{7}
// User.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public users = Record.new<IUser[]>('/api/users')
        .swapMethod('greedy')
}

export default defineStore<User>(User)
```

## Кэширование запросов <Badge type="tip" text="Работает только на клиенте" />

::: warning ⚠ Кэширование постоянно дорабатывается
 
:::

Для запросов есть возможность кэширования на клиенте. Для этого создаются метки, по которым будет производиться кэширование:

```ts
const posts = Record.new<IResponseType>('/api/posts')
    // Будем сохранять запрос по Search параметру page
    // Метка 'full' обозначает сохранять все запросы, а не последний
    .createTag('query:page', 'full')
```

Пример:

```ts
// Делаем запрос
await posts.query({ page: 1 }).get()

// Теперь мы можем достать этот запрос
posts.cached({ page: 1 })
```
Метод `cached` работает по принципу поиска значения по тэгам. Давайте рассмотрим, как ещё можно сформировать запрос на получение кэшированых данных:
```ts
// Достать Response если: page == 1
posts.cached({ page: 1 })
// Достать Response если: page != null
posts.cached({ page: '*' })
// Достать Response если: page == null
posts.cached({ page: null })
// Достать Response если: page != (пред. результат) page
posts.cached({ page: '<>' })
```

### Preset: useCached

Для автоматизации использования кэширования был разработан `useCached` пресет

```ts{5-6}
import { Record } from 'nuxoblivius'
import { useCached } from 'nuxoblivius/presets'

const posts = Record.new<IResponseType>('/api/posts')
    // Указываем тэги (тэги будут созданы автоматически)
    .preset(useCached(['query:page']))
```

Он позволяет использовать данные старых запросов вместо запуска нового.

`useCached` заменяет собой такую структуру:

```ts
const posts = Record.new<IResponseType>('/api/posts')
    .preset(useCached(['query:page'])) // [!code ++]
    .createTag('query:page', 'full') // [!code --]
    .rule({ 'page': '*' }, $ => { // [!code --]
        $.onlyOnEmpty().response = // [!code --]
            $.cached({ 'page': posts.params.query }) // [!code --]
            ?? $.onlyOnEmpty(false).response // [!code --]
    }) // [!code --]
```

[(Кэширование + Пагинация) демо](/release/record.md#пагинация-демо-кэширование)

## SPA оптимизация

## ⚡ Event: Конец запроса

## ⚡ Event: Ошибка запроса