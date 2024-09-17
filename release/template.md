# Records Templates

## Основы

Для избавления от рутинных действий при работе с API предусмотрены `template`-ы, задача которых - автоматическое переформатирование приходящих с API данных.

## Использование

Пример исходных данных:
```json
{
    "data": [
        {
            "id": 0,
            "title": "Some Article",
            "desc": "Test Description"
        }
    ],
    "meta": {
        "total_count": 56,
        "current_page": 2,
        "per_page": 3
    }
}
```

Единственная полезная часть ответа - содержимое data (к meta-данным также можно иметь доступ, об этом позже).

Можно написать template функцией `RegisterTemplate`:

```ts
import {RegisterTemplate} from 'nuxoblivius'

RegisterTemplate('my-template', (raw: object) => {
    if(raw.data) 
        return {
            data: raw.data,
            pageCount: raw.meta?.total_count / raw.meta?.per_page ?? 1 // определяем количество страничек, чтобы знать, на каком моменте остановить пагинацию
        }
    else return raw
})
```

, а затем использовать его при определении [Record](/release/records.html)-а:

```ts{15}
import {Record} from 'nuxoblivius'

const articles = Record.new<IArticle>('/api/articles')
    .template('my-template')

await articles.get()

console.log(articles.response)
/**
 * [
 *    {
 *       "id": 0,
 *       "title": "Some Article",
 *       "desc": "Test Description"
 *    }
 *    ...
 * ]
 */
```

Также можно написать template-функцию и прямо в `Record`:

```ts{2-7}
const articles = Record.new<IArticle>('/api/articles')
    .template((raw) => {
        return {
            data: raw.data,
            pageCount: raw.meta?.total_count / raw.meta?.per_page ?? 1
        }
    })

await articles.get()
```

## Template вне Record

Предоставляется возможность использовать template-функцию вне `Record` и `Stor`-а как такового - применимо к любому объекту функцией:

```ts{10}
import {RegisterTemplate, CallPattern} from 'nuxoblivius'

RegisterTemplate(
    'unpack-template', 
    (raw: object) => ({ data: raw.data })
)

const myData = { 'data': [ { message: 'message_1' } ...] }

const { data: formatedData } = CallPattern('unpack-template', myData)
/**
 * [{ message: 'message_1' } ...]
 */
```
Функция `CallPattern` распаковывает данные из любого объекта согласно прописанному шаблону.

## Цепочка Template

Можно использовать `templat`-ы и цепочками:

```ts
RegisterTemplate(
    'unpack-template', 
    (raw: object) => ({ data: raw.data })
)

RegisterTemplate(
    'format', 
    (unpackTemplate: object) => ({ 
        data: CallPattern('unpack-template', unpackTemplate).data.map(() => <some logic>) 
    })
)

const { data: formatedData } = CallPattern('format', myData)
```

## Protocol

Можно дать доступ к дополнительной информации из ответа api, используя объект `protocol` внутри template и функцию `defineProtocol`:

```ts{5,6,7,10,14}
const articles = Record.new<IArticle>('/api/articles')
    ...
    .template((raw: object) => ({ 
        data: raw.data,
        protocol: {
            meta: raw.meta
            secondData: 'other data'
        } 
    }))
    // Define protocol for reading data from template
    .defineProtocol<IMetaResponse>('meta', {} /* Default Value */)
    .defineProtocol<IMetaResponse>('secondData', '' /* Default Value */)
    .defineProtocol<IMetaResponse>('thirdData', 'third' /* Default Value */)

await articles.get()

console.log(articles.protocol.meta)
/**
 * {
 *    current_page: 1,
 *    total: 20,
 *    perPage: 10
 * }
 */
console.log(articles.protocol.secondData)
/**
 * 'other data'
 */
console.log(articles.protocol.thirdData)
/**
 * 'third'
 */
```
Такие данные доступны не из объекта [response](/release/records.html#response), а из отдельного объекта protocol.
