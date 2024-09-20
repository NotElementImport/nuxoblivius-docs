# Records

`Record`-ы (записи) - объекты для работы с данными, подгружаемыми с API, предлагающие множество полезных функций и свойств для удобства работы.

## Определение
`Record` создаётся функцией `new('path-to-api', init)`:

```ts{6}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class UserInfo {
    public getUserInfo = Record.new<IUserInfo>('/api/user/info', {})
}

export default defineStore<UserInfo>(UserInfo)
```
, принимающей 1-м аргументом путь к api; 2-м аргументом (по желанию) - значение для инициализации (по умолчанию - null).

## GET

Для осуществления самих запросов к API `Record` предлагает функции `get()`, `post()`, `put()`, `delete()`.
Все 4 функции возвращают Promise со значением с API. Отметим, что данное возвращаемое значение не будет реактивным. Реактивное значение доступно из [ref](/release/store/prop.html#ref), либо из свойства [response](/release/records.html#response).

`get()` - осуществляет get-запрос. Может принимать аргумент `id`, который будет работать как [path param](/release/records.html#path-params).

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

`post()` - осуществляет post-запрос. Может принимать аргумент body в виде объекта (для JSON) либо FormData.

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

`put()` - осуществляет put-запрос. Абсолютно аналогично методу [post](/release/records.html#post) может принимать объект для JSON, либо FormDat-у.

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

`delete()` - осуществляет delete-запрос. Аналогично методу [get](/release/records.html#get) может принимать в аргументе id, который будет работать как [path param](/release/records.html#path-params).

Примеры:
```ts
record.delete() // без аргумента
record.delete(1) // с аргументом
// или:
record.delete('1') // с аргументом

// Использование:
const result = await record.delete()
```

## PATCH

`patch()` - осуществляет patch-запрос. Аналогично предыдущим методам, в аргументе может принимать id, либо же объект для JSON/FormDat-у.

Примеры:
```ts
record.patсh(1)

// также можно:
const formData = new FormData()
formData.append('my', 'formData')
record.patch(formData)
```

## Response

`Response` - реактивное свойство, содержащее непосредственно значение Record-а (пришедшее с API) на данный момент. 

Использование:
```vue
<script setup lang='ts'>
...
await myStore.record.get()
...
</script>
<template>
    <!-- Реактивное свойство, SSR-friendly: -->
    {{ myStore.record.response }}
</template>
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

## Query-параметры к API

Можно приложить к запросу объект с query-параметрами в аргументе к функции `query()`:

```ts{7}
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
Динамические параметры могут быть записаны двумя способами, подробнее: [Динамические параметры](/release/sub-store.html#dynamic-params)

Чтобы при каждом изменении query-параметра запрос осуществлялся заново, можно использовать функцию `reloadBy`:

## ReloadBy

```ts{9}
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
myRecordObject.clearDynamicQuery()
```

Можно передать все пары "ключ-значение" из Sub Stor-а в качестве query-параметров: [Query-параметры из Sub Store](/release/sub-store.html#sub-stores-as-query)

## Path-параметры

`Record` поддерживает путь к api вида `/api/user/get/{id}`

Пример:
```ts{9}
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

## Headers

`Record` позволяет прописывать к запросам заголовки:

Пример:
```ts{7}
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

Либо - для упрощенной записи - прописывать данные авторизации через функции `Bearer` либо `Basic`:

```ts
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

## Body Request

Можно прописать тело запроса в виде объекта (который сконвертируется в JSON) либо FormData в аргументе функции `body()`:

```ts
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

## Пагинация

Имеются инструменты для удобной работы с пагинацией.

```ts
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
    + либо `path:${id}`, если переключение осуществляется по изменениям [path-параметра](/release/records.html#Path-параметры) (после `/` ). После двоеточия - название path-параметра.
* `current` - текущая страница пагинации
* `lastPage` - номер последней страницы (определяется из meta-данных ответов через параметр `pageCount` в настройках [template](/release/records-caching.html))
* `isLastPage` - является ли текущая страница последней (true/false)
* `autoReload()` - автоматическая подгрузка новых данных при изменении номера страницы. Если не объявить - автоподгрузку нужно будет осуществлять вручную (например, используя [reloadBy](/release/records.html#ReloadBy)).
* `next()` - увеличение текущей страницы на 1 (если текущая страница не является последней)
* `prev()` - уменьшение текущей страницы на 1 (если текущая страница не является первой)
* `toFirst()` - перемещение к первой странице
* `toLast()` - перемещение к последней странице

Если в response необходимо суммировать (а не перезаписывать) страницы - можно использовать функцию [appendsResponse](/release/records.html#appendsResponse) над `Record`.

## Заголовки ответа

Можно иметь доступ к заголовкам ответа:

```ts
myStore.record.headers.get('Content-Type')
```

## isLoading

Доступно реактивное булевое свойство, показывающее, идёт ли загрузка с API в данный момент:

```ts
console.log(myStore.record.loading)
```

## Ошибки

Доступны свойства `error` и `errorText`, содержащие информацию об ошибках с API при их наличии:

Использование:
```ts
myStore.record.get()

if(myStore.record.error) // true или false
    console.log('Что-то пошло не так: ', myStore.record.errorText) // текст ошибки
```

## onFailure

Функция, позволяющая в случае ошибки с API выполнить определенные действия.

```ts
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
* `reason` - объект, состоящий из двух ключей: `text` (содержащий errorText запроса) и `code` (код ошибки).
* `retry` - функция запроса, вызвавшего ошибку. При желании можно осуществить этот запрос заново.

## onFinish

Функция, позволяющая после завершения запроса к API выполнить определенные действия.

```ts
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

## then

Функция, позволяющая выполнить определенные действия после выполнения любой другой функции `Record`-а.

После функций, возвращающих Promise, можно использовать и стандартный `then` из JavaScript, однако предоставляемую `Record`-ом функцию можно использовать и в таких случаях, как:

```ts
record.pagination.next().then(_ => {console.log('Подгрузили следующую страницу')}) // после функций пагинации
record.clearResponse().then(_ => {console.log('Response был очищен')}) // после функции очистки Respons-а
```

## onlyOnEmpty

Функция, благодаря которой запросы к API для одного `Record`-а не будут повторяться в рамках сессии (например, при открытии пользователем одной и той же страницы повторно).

```ts
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

## borrowFrom

Функция, позволяющая одному `Record`-у брать данные из другого `Record`-а (при наличии там).

Пример:

```ts
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

## appendsResponse

Функция, используя которую, при многократных запросах одного `Record`-а к API все [Response](/release/records.html#Response)-ы будут суммироваться в один. Может быть полезным для [пагинации](/release/records.html#Пагинация).

```ts
// User.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public users = Record.new<IUser[]>('/api/users')
        .pagination.setup('query:page') // инициализация пагинации
        .appendsResponse() // суммирование страничек
}

export default defineStore<User>(User)
```

## clearResponse

Функция, очищающая [Response](/release/records.html#Response) (можно изменять response и напрямую, но не рекомендуется).

```ts{7}
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
```ts
// User.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public users = Record.new<IUser[]>('/api/users')
        .swapMethod('greedy')
}

export default defineStore<User>(User)
```

## Динамические параметры

Как уже показано в примерах - все функции могут принимать в себя как статические, так и динамические параметры:

```ts{7}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public contentType: string = 'application/json'

    public getUser = Record.new<IUser>('/api/user/get/{id}')
        .header('Content-Type', this.contentType) // статический параметр - единожды запишется текущее значение contentType, дальнейшие изменения не отслеживаются

    public getUserDynamic = Record.new<IUser>('/api/user/get/{id}')
        .header('Content-Type', this.ref.contentType) // динамический параметр
    // или:
    public getUserDynamic = Record.new<IUser>('/api/user/get/{id}')
        .header('Content-Type', () => this.contentType) // динамический параметр
}

export default defineStore<User>(User)
```
, причём динамические параметры можно прописать двумя разными способами (не отличающимися по работоспособности).

При этом запрос к api не будет осуществляться при изменениях динамического параметра автоматически. Для реактивности запросов к api используется функция [reloadBy](/release/records.html#reloadBy)
