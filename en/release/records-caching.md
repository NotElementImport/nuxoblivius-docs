# Records Caching

## Overview

To speed up development, you can use templates that will allow you to break down a request into parts or sub-adjust it

Templates using where need procces raw data from server like:

If we need to decompress data from data, and set the value to max pages.\
Example JSON:
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
        "count_pages": 10,
        ...
    }
}
```
You can make it easier while working.\
Specify which is data, and which is information about the number of pages

## Basic example

```ts
import {RegisterTemplate} from 'nuxoblivius'

RegisterTemplate('my-template', (raw: object) => {
    if(raw.data) 
        return {
            // Unpack data
            data: raw.data,
            // Set count of pages
            pageCount: raw.meta?.count_pages ?? 1
        }
    // Else returns raw
})
```

We get that when we make a query, we will work with `data` at once

```ts{15}
import {Record, RegisterTemplate} from 'nuxoblivius'

RegisterTemplate('my-template', (raw: object) => {
    if(raw.data) 
        return {
            // Unpack data
            data: raw.data,
            // Set count of pages
            pageCount: raw.meta?.count_pages ?? 1
        }
    // Else returns raw
})

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
console.log(articles.pagination.current)
/**
 * 1 
*/
```

## Inline template

Templates can also be written directly in `Record`.

```ts{2-7}
const articles = Record.new<IArticle>('/api/articles')
    .template((raw) => {
        return {
            data: raw.data,
            pageCount: raw.meta?.count_pages ?? 1
        }
    })

await articles.get()
```

## Off-the-record use

Framework, has a tool to call template by name, any `object` format data can be used

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

## Chain of template

You can make a chain of calls

```ts
RegisterTemplate(
    'unpack-template', 
    (raw: object) => ({ data: raw.data })
)

RegisterTemplate(
    'format', 
    (raw: object) => ({ 
        data: CallPattern('unpack-template', raw).data.map(() => <some logic>) 
    })
)

const { data: formatedData } = CallPattern('format', myData)
```

## Protocol

You can pull additional information from the template

```ts{5,6,7,10,14}
const articles = Record.new<IArticle>('/api/articles')
    ...
    .template((raw: object) => ({ 
        data: raw.data,
        protocol: {
            meta: raw.meta
        } 
    }))
    // Define protocol for reading data from template
    .defineProtocol<IMetaResponse>('meta', {} /* Default Value */)

await articles.get()

console.log(articles.protocol.meta)
/**
 * {
 *    current_page: 1,
 *    total: 20,
 *    perPage: 10
 * }
 */
```