# Records

`Records` is the object that is requested by the api

## Определение
`Record` создаётся функцией `new('path-to-api')`

```ts{6}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class UserInfo {
    public getUserInfo = Record.new<IUserInfo>('/api/user/info')
}

export default defineStore<UserInfo>(UserInfo)
```

## GET

Для осуществления самих запросов к API `Record` предлагает функции `get()`, `post()`, `put()`, `delete()`.
Все 4 функции возвращают Promise со значением с API. Отметим, что данное возвращаемое значение не будет реактивным. Реактивное значение доступно из [ref](/release/store/prop.html#ref), либо из свойства [response](/release/records.html#response).

`get()` - осуществляет get-запрос. Может принимать аргумент (id либо slug), который может работать как [path param](/release/records.html#path-params).

Примеры:
```ts
record.get() // без аргумента
record.get(1) // с аргументом
// или
record.get('1') // с аргументом

// Использование:
const result = await record.get()
```

## POST

`post()` - осуществляет post-запрос. Может принимать аргумент body в виде объекта (для JSON) либо FormData, который также может работать как [path param](/release/records.html#path-params).

Примеры:
```ts
record.post() // без аргумента

// JSON:
record.post({'my': 'json'})

// или FormData:
const formData = new FormData()
formData.append('my', 'formData')
record.post(formData)

// Использование:
const result = await record.post()
```

## PUT

`put()` - осуществляет put-запрос. Абсолютно аналогично методу [post](/release/records.html#post) может принимать объект для JSON, либо FormDat-у, и работает как [path param](/release/records.html#path-params).

Примеры:
```ts
record.put() // без аргумента

// JSON:
record.put({'my': 'json'})

// или FormData:
const formData = new FormData()
formData.append('my', 'formData')
record.put(formData)

// Использование:
const result = await record.put()
```

## DELETE

`delete()` - осуществляет delete-запрос. Аналогично методу [get](/release/records.html#get) может принимать id либо slug, который будет восприниматься как [path param](/release/records.html#path-params).

Примеры:
```ts
record.delete() // без аргумента
record.delete(1) // с аргументом
// или:
record.delete('1') // с аргументом

// Использование:
const result = await record.delete()
```

## Response

`Response` - реактивное свойство, содержащее непосредственно значение свойства Record-а на данный момент. 

Использование:
```vue
<script setup lang='ts'>
...
myStore.record.get()
...
</script>
<template>
    <!-- Реактивное свойство, SSR-friendly: -->
    {{ myStore.record.response }}
</template>
```

## Query-параметры к API

Можно приложить к запросу объект с query-параметрами в аргументе к функции `query()`:

```ts{7}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class UserInfo {
    public getUserInfo = Record.new<IUserInfo>('/api/user/info')
        .query({
            param: 'value',
            group: {
                param: 'value'
            }
        })
}

export default defineStore<UserInfo>(UserInfo)
```

Query-параметры могут быть динамическими и реактивными:

```ts{11}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class UserInfo {
    public myValue: number = 0

    public getUserInfo = Record.new<IUserInfo>('/api/user/info')
        .query({
            'my-param': this.ref.myValue // обращаемся через ref к реактивному свойству Stor-a
            // при каждом изменении значения myValue запрос будет осуществляться заново.
        })
}

export default defineStore<UserInfo>(UserInfo)
```

, также и нереактивными:

```ts{9}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

let myParam = 0

Record.new<IUserInfo>('/api/user/info')
    .query({
        'my-param': () => myParam // передали свойство не через ref
        // при изменениях свойства запрос не будет осуществляться заново, но при ручном повторном вызове будет передано обновлённое значение
    })
```

Есть функция для очистки query-параметров `Record`-а:

```ts
myRecordObject.clearDynamicQuery()
```

Можно передать все пары "ключ-значение" из Sub Stor-а в качестве query-параметров: [Query-параметры из Sub Store](/release/sub-store.html#sub-stores-as-query)

Also can read a [Dynamic Params in Query](/release/store/dynamic-params.html)

## Path-параметры

`Record` поддерживает path-параметры вида `/api/user/get/{id}`

Пример:
```ts{9}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public idUser: number = 0

    public getUser = Record.new<IUser>('/api/user/get/{id}')
        .pathParam('id', this.ref.idUser)
}

export default defineStore<User>(User)
```
, после чего при использовании свойства можно будет передать в аргументе id (все примеры использования - позже).

Если был передан null, то параметр не дописывается.

They also supported [Dynamic Params](/release/store/dynamic-params.html)

## Headers

`Record` позволяет прописывать к запросам заголовки:

Пример:
```ts{7}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public getUser = Record.new<IUser>('/api/user/get/{id}')
        .header('Content-Type', 'application/json')
}

export default defineStore<User>(User)
```

They also supported [Dynamic Params](/release/store/dynamic-params.html)

## Авторизация

`Record` позволяет добавлять заголовок авторизации:

```ts{7}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public getUser = Record.new<IUser>('/api/user/get/{id}')
        .auth('Baerer as|asd%120_xcas1oa7x6')
}

export default defineStore<User>(User)
```

Либо - для упрощенной записи - прописывать данные авторизации через функции `Bearer` либо `Basic`:

```ts
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public getUser = Record.new<IUser>('/api/user/get/{id}')
        .auth(Record.Bearer('as|asd%120_xcas1oa7x6'))
        // или:
        .auth(Record.Basic('login', 'password'))
}

export default defineStore<User>(User)
```

They also supported [Dynamic Params](/release/store/dynamic-params.html)

## Body Request

Можно прописать тело запроса в виде объекта (который сконвертируется в JSON) либо FormData в аргументе функции `body()`:

```ts{8}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public getUser = Record.new<IUser>('/api/user/get/{id}')
        // Support object and Form Data
        .body({ myData: true })
}

export default defineStore<User>(User)
```

They also supported [Dynamic Params](/release/store/dynamic-params.html)

## Заголовки ответа

Можно иметь доступ к заголовкам ответа:

```ts
myStore.record.headers.get('Content-Type')
```

## Ошибки

Доступны свойства `error` и `errorText`, содержащие информацию об ошибках с API при их наличии:

Использование:
```ts
myStore.record.get()

if(myStore.record.error) // true или false
    console.log('Что-то пошло не так: ', myStore.record.errorText) // текст ошибки
```

## isLoading

Доступно реактивное булевое свойство, показывающее, идёт ли загрузка с API в данный момент:

```ts
console.log(myStore.record.loading)
```

## Blob

Доступна функция `isBlob()` для работы с Blob-ами, получаемыми с API:

Пример использования:
```ts
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
