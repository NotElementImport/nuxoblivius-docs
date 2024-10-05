# Record (Fetch)

::: tip 📃 Старая статья
Можено глянуть старую статью [тут "Records"](/release/records) 
:::

В Nuxoblivius-е есть свой Fetch клиент, для запросов. Он унифицирует и улучшает, опыт программирования.

Создание Record (-а):

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

## Обработка запросов

Для отправки запроса мы можем использовать следующие методы:

::: code-group
```ts{5} [GET]
import { Record } from 'nuxoblivius'

const testRecord = Record.new<IResponseType>('/api/test')

testRecord.get()
    .then(e => console.log(e))

// Для уменьшения кода метод get(), содержит аргумент id.
// В котором если выставить значение, отработает как:
// pathParam('id', ваше значение) 
// Если не ставить значение, pathParam будет стёрт
```
```ts{5} [POST]
import { Record } from 'nuxoblivius'

const testRecord = Record.new<IResponseType>('/api/test')

testRecord.post()
    .then(e => console.log(e))

// Для уменьшения кода метод post(), содержит аргумент body.
// В котором если выставить значение, отработает как:
// body(ваше значение) 
// Если не ставить значение, body будет стёрт
```
```ts{5} [PUT]
import { Record } from 'nuxoblivius'

const testRecord = Record.new<IResponseType>('/api/test')

testRecord.put()
    .then(e => console.log(e))

// Для уменьшения кода метод put(), содержит аргумент body.
// В котором если выставить значение, отработает как:
// body(ваше значение) 
// Если не ставить значение, body будет стёрт
```
```ts{5} [PATCH]
import { Record } from 'nuxoblivius'

const testRecord = Record.new<IResponseType>('/api/test')

testRecord.patch()
    .then(e => console.log(e))

// Для уменьшения кода метод patch(), содержит аргумент body.
// В котором если выставить значение, отработает как:
// body(ваше значение) 
// Если не ставить значение, body будет стёрт
```
```ts{5} [DELETE]
import { Record } from 'nuxoblivius'

const testRecord = Record.new<IResponseType>('/api/test')

testRecord.delete()
    .then(e => console.log(e))

// Для уменьшения кода метод delete(), содержит аргумент id.
// В котором если выставить значение, отработает как:
// pathParam('id', ваше значение) 
// Если не ставить значение, pathParam будет стёрт
```
:::

## Получаем реактивный Response

После отправки мы получаем статический Response, но можно получить и реактивный Response

::: code-group
```vue{10} [Без SSR]
<script setup lang="ts">
import { Record } from 'nuxoblivius'

const posts = Record.new<IResponseType>('/api/posts')

posts.get()
</script>
<template>
    <!-- Реактивный Response -->
    <pre> {{ posts.response }} </pre>
</template>
```
```vue{11} [SSR]
<script setup lang="ts">
import { Record } from 'nuxoblivius'

const posts = Record.new<IResponseType>('/api/posts')

// Что-бы SSR правильно работал надо использовать await
await posts.get()
</script>
<template>
    <!-- Реактивный Response -->
    <pre> {{ posts.response }} </pre>
</template>
```
```vue{15} [Lazy SSR]
<script setup lang="ts">
import { Record, useLazySpread } from 'nuxoblivius'

const posts = Record.new<IResponseType>('/api/posts')

// Не будет задерживать отрисовку на клиенте
// Так-же позволяет на сервере одновременно
// делать несколько запросов, без сильных задержек
await useLazySpread([
    () => posts.get()
]) 
</script>
<template>
    <!-- Реактивный Response -->
    <pre> {{ posts.response }} </pre>
</template>
```
:::

## Обработка ошибок

Запрос может вернуть ошибку

::: code-group
```ts{7-10} [Через свойство]
import { Record } from 'nuxoblivius'

const posts = Record.new<IResponseType>('/api/posts')

await posts.get()

// Свойство error реактивно
if(posts.error) {
    console.log('Ops something wrong', posts.response)
}
```
```ts{4} [Через функцию]
import { Record } from 'nuxoblivius'

const posts = Record.new<IResponseType>('/api/posts')
    .onFailure(_ => console.log('Ops something wrong', posts.response))

await posts.get()
```
:::

## Обработка ожидания ответа

Так-же можно сделать обработку загрузки данных на клиенте

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

## Обработка Headers результата

Что-бы прочитать хэдеры результата запроса надо использовать headers свойство

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

Recod имеет мощный builder для запросов

### Query / Search Params

Настройка Query для запроса можно так

::: code-group
```ts [Нативно]
const posts = Record.new<IResponseType>('/api/posts')
    .query({ name: 'Post number 1' })

// Result: /api/posts?name=Post number 1
```
```ts [Динамически]
const size = ref(13)
let   withAuthor = false

const posts = Record.new<IResponseType>('/api/posts')
    .query({ size, author: () => withAuthor })

// Result: /api/posts?size=13&author=false

size.value = 10
withAuthor = true

// Result: /api/posts?size=10&author=true
```
```ts [В строке запроса]
const posts = Record.new<IResponseType>('/api/posts?size=10')

// Result: /api/posts?size=10
```
:::

Так-же для Query, есть возможность запечь некоторые значения, их можно перезаписать но удалить не возможно

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

Отчистка query делается таким методом:

```ts
posts.clearDynamicQuery() // Удаляет всё кроме запеченных значений
```

### Path Params

Настройка Path Param, для запроса можно так

::: info Path Param
Это параметры для url запроса пример:
/api/test/\{id\}

\{id\} - Это path параметр
:::

::: code-group
```ts [Нативно]
const post = Record.new<IResponseType>('/api/posts/{id}')
    .pathParam('id', 1)

// Result: /api/posts/1
```
```ts [Динамически]
const id = ref(13)

const posts = Record.new<IResponseType>('/api/posts/{id}')
    .pathParam('id', id)
    // Или
    .pathParam('id', () => id.value)

// Result: /api/posts/13

id.value = 2

// Result: /api/posts/2
```
```ts [State Manager]
class Posts {
    public id: number = 1

    public one = Record.new<IResponseType>('/api/posts')
        .pathParam('id', this.ref.id)
}

export default defineStore(Posts)
```
```ts [В строке запроса]
const posts = Record.new<IResponseType>('/api/posts/1')

// Result: /api/posts/1
```
:::

### Body

Выставить Body для запроса

::: code-group
```ts [JSON]
const post = Record.new<IResponseType>('/api/store')
    // Автоматическая настройка:
    .body(Record.json({ test: '' }))
    // Или ручная
    .body({ test: '' })
    .header("Content-Type", "application/json")
```
```ts [FormData]
const formData = new FormData()
formData.append('test', '')

const posts = Record.new<IResponseType>('/api/store')
    .body(formData)
```
```ts [URL Encoded]
const posts = Record.new<IResponseType>('/api/store')
    .body(Record.urlEncoded({ test: '' }))
```
```ts [Убрать]
const posts = Record.new<IResponseType>('/api/store')
    .body(null)
```
:::

### Headers

Так-же можно настроить хэдеры запроса

::: code-group
```ts [Нативно]
const posts = Record.new<IResponseType>('/api/posts')
    .header('Accept-Language', 'en')
```
```ts [Динамически]
const lang = ref('en')

const posts = Record.new<IResponseType>('/api/posts')
    .header('Accept-Language', lang)
    // Или
    .header('Accept-Language', () => lang.value)
```
```ts [State Manager]
class Posts {
    public lang: string = 'en'

    public all = Record.new<IResponseType>('/api/posts')
        .header('Accept-Language', this.ref.lang)
}

export default defineStore(Posts)
```
```ts [Убрать]
const posts = Record.new<IResponseType>('/api/store')
    .header('Accept-Language', null)
```
:::

### Blob Response

Можно поменять форматирование response на blob

::: code-group
```ts [Включить]
const posts = Record.new<IResponseType>('/api/posts')
    .isBlob()
```
```ts [Выключить]
const posts = Record.new<IResponseType>('/api/posts')
    .isBlob(false)
```
:::

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

## Шаблоны `Pattern Response Reader`

Record поддерживает редактирование `Response` запроса, для этого используется `template()`. Шаблоны позволяют уменьшить код и улучшить производительность написания кода

Пример (`Входные данные`):
```json
{
    "items": [ 
        {
            "title": "Test Title",
            "content": "My content"
        }
        ...
    ],
    "total": 30,
    "lastPage": 3,
    "perPage": 10
}
```
Пример (`Обработка`):

::: code-group
```ts [Inline]
const posts = Record.new<IResponseType>('/api/posts')
    .template(raw => {
        if(raw.items) {
            return {
                data: raw.items, // Данные с которыми будем рабоать
                pageCount: raw.lastPage // Кол-во страниц с данными
            }
        }
    })
```
```ts [Global Definition]
import { Record, RegisterTemplate } from 'nuxoblivius'

// Регистрируем шаблон для многократного использования
RegisterTemplate('Read items', raw => {
    if(raw.items) {
        return {
            data: raw.items, // Данные с которыми будем рабоать
            pageCount: raw.lastPage // Кол-во страниц с данными
        }
    }
})

const posts = Record.new<IResponseType>('/api/posts')
    .template('Read items')
```
:::

На выходе выйдет так

```ts
await posts.get()

console.log(posts.response)
/**
 * Result:
 * [{ title: "Test Title", content: "My content" }, ...]
 */
```
### Доп данные (Protocol)

## Модуль пагинации

Можно настроить пагинацию для запроса

::: code-group
```ts [Query / Search Param]
Record.new<IResponseType>('/api/posts')
    // Добавляем, включаем пагинацию
    // page добавиться в search params
    // /api/posts?page=1
    .pagination.setup('query:page')
```
```ts [Path Param]
Record.new<IResponseType>('/api/posts/{page}')
    // Добавляем, включаем пагинацию
    // page добавиться в search params
    // /api/posts/1
    .pagination.setup('path:page')
```
:::

⚠ Обязательно для пагинации нужно использовать [#шаблон](/release/record.md#шаблоны-pattern-response-reader) ⚠

```ts{7}
Record.new<IResponseType>('/api/posts')
    // data -> Возвращает сами элементы с которыми будем работать
    // pageCount -> Кол-во страниц доступных для пагинации
    .template(raw => ({ data: raw.items, pageCount: raw.lastPage }))
```

Так-же можно добавить авто перезагрузку данных, когда меняется страница

```ts{3}
Record.new<IResponseType>('/api/posts')
    .pagination.setup('query:page')
    .pagination.autoReload()
```

Запуск пагинации

::: code-group
```ts{4} [След. стр.]
const posts = Record.new<IResponseType>('/api/posts')
    .pagination.setup('query:page')

posts.pagination.next()
```
```ts{4} [Пред. стр.]
const posts = Record.new<IResponseType>('/api/posts')
    .pagination.setup('query:page')

posts.pagination.prev()
```
```ts{4} [На первую]
const posts = Record.new<IResponseType>('/api/posts')
    .pagination.setup('query:page')

posts.pagination.toFirst()
```
```ts{4} [На последнию]
const posts = Record.new<IResponseType>('/api/posts')
    .pagination.setup('query:page')

posts.pagination.toLast()
```
```ts{4} [Выбрать]
const posts = Record.new<IResponseType>('/api/posts')
    .pagination.setup('query:page')

posts.pagination.current = 2
```
:::

Обработка пагинации

```ts
const posts = Record.new<IResponseType>('/api/posts')
    .pagination.setup('query:page')

// Получить страницу
console.log(posts.pagination.current)
// Result: 1

// Последняя страница
console.log(posts.pagination.lastPage)
// Result: 10

// Это последняя страница?
console.log(posts.pagination.isLastPage)
// Result: false
```
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

## Авто перезапуск запроса <Badge type="tip" text="Работает только на клиенте" />

Авто перезапуск запроса, это отслеживания свойство, и когда оно меняется Record автоматически перезапускает запрос

```ts{5}
const q = ref("") // String for search

Record.new<IResponseType>('/api/posts/search')
    .query({ q })
    .reloadBy(q)
```
Авто перезапуск демо

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

## Кэширование запросов <Badge type="tip" text="Работает только на клиенте" />

::: warning ⚠ Кэширование постоянно дорабатывается
 
:::

Для запросов есть возможность кэширования на клиенте.

Для этого создаются метки по которым будет производится кэширования

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
Метод `cached` работает по принципу поиску по тэгам, давайте рассмотрим как ещё можно сформировать запрос на получение кэшированых данных
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

Он позволяет использовать старые запросы, заместо запуска нового запроса

`useCached` заменяет вот такую структуру

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

[(Кэширования + Пагинация) демо](/release/record.md#пагинация-демо-кэширование)

## SPA оптимизация

## ⚡ Event: Конец запроса

## ⚡ Event: Ошибка запроса