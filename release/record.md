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

:::info Path Param
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

## Авто перезапуск запроса

Авто перезапуск запроса, это отслеживания свойство, и когда оно меняется Record автоматически перезапускает запрос

```ts{5}
const q = ref("") // String for search

Record.new<IResponseType>('/api/posts/search')
    .query({ q })
    .reloadBy(q)
```

Demo:

:::details 💡 Исходный код
```vue
<script setup lang="ts">
import { Record } from 'nuxoblivius'
import { ref } from 'vue'

const q = ref('')

Record.new<IResponseType>('/api/posts/search')
    .oneRequestAtTime()
    .query({ q, limit: 3 })
    .reloadBy(q)

Posts.get()
</script>
<template>
    <SearchToolbar v-model="q"/>
    <section :class="['list', Posts.loading && 'list-loading']">
        <article clas="article" v-for="post in posts.response">
            <div class="title"> {{ post.title }} </div>
            <div class="body">  {{ post.body }} </div>
        </article>
    </section>
</template>
```
:::

<script setup>
import { ref } from 'vue'
import { Record } from 'nuxoblivius'

const q = ref('')

const posts = Record.new('https://dummyjson.com/posts/search')
    .oneRequestAtTime()
    .template(raw => ({ data: raw.posts }))
    .query({ q, limit: 3, select: "title,body" }, true)
    .reloadBy(q)

posts.get()
</script>
<section class="playground">
    <section class="tools">
        <button @click="e => posts.get()">
            🔍
        </button>
        <input
            v-model.lazy="q"
            style="flex: 1 1;"
            placeholder="Поиск..."
        />
    </section>
    <section :class="['list', posts.loading && 'loading']" style="min-height: 392px;">
        <article class="playground-object" v-for="item in posts.response">
            <section class="main limit-text">
                {{ item.title }}
            </section>
            <section class="sub limit-text">
                {{ item.body }}
            </section>
        </article>
    </section>
    <a style="margin-top: 0.5em; display: inline-block; opacity: 0.5;" href="https://dummyjson.com/"> Posts by: DummyJSON </a>
</section>

## Кэширование запросов <Badge type="warning" text="⚠ Работает только на клиенте" />

::: info Важно
Кэширование постоянно дорабатывается
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

## Тонкая настройка

## SPA оптимизация

## ⚡ Event: Конец запроса

## ⚡ Event: Ошибка запроса