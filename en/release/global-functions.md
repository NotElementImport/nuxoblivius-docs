# Global Functions

`Records` More about optimizations and features of Records

## Templates <Badge type="info" text="^ 1.1.0" style='margin-top: 7px;'/>  

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
```ts
import {RegisterTemplate} from 'nuxoblivius'

// define template
// Give name, and functionality
RegisterTemplate('unpack-data', (raw: IRawArticles) => {
    if(raw.data) 
        return {
            // Unpack data
            data: raw.data,
            // Set count of pages
            pageCount: raw.meta?.count_pages || 1
        }

    // other cases automaticly returns raw result
})
```
We can extending from another template, to map data content or other sequences
```ts
import {RegisterTemplate, CallPattern} from 'nuxoblivius'

// Give name, and functionality
RegisterTemplate('unpack-data', (raw: IRawArticles) => {
    if(raw.data) 
        return {
            // Unpack data
            data: raw.data,
            // Set count of pages
            pageCount: raw.meta?.count_pages || 1
        }

    // other cases automaticly returns raw result
})

RegisterTemplate('unpack-data-and-structing', (raw: IRawArticles) => {
    // Calling another template
    raw = CallPattern('unpack-data', raw)

    if(raw.data) {
        // Adding checking for existence of Description 
        raw.data = raw.data.map(
            (value) => ({
                ...value,
                hadDescription: value.desc ? true : false
            })
        )

        return raw
    }
})
```

Using in `Records`

```ts
// Articles.ts

import {defineStore, Record} from 'nuxoblivius'

class Articles {
    public articles = Record.new<IArticle>('/api/articles')
        .template('unpack-data-and-structing')
        // Also can do like that
        .template((raw: IRawArticle) => {
            return { data: raw.data }
        })
        ...
}

export default defineStore<Articles>(Articles)
```

More in [Records (Templates)](/release/records-caching.html)

## Temp Caching Responses <Badge type="info" text="^ 1.1.0" style='margin-top: 7px;'/>  

`Records` also can caching responses, and getting caching responses

### Rules

In `Records`, a system with `Rules` is used to cache the response. The `Rules` are needed to specify how to retrieve certain data, and also as conditions in some methods.

Declaration of `Rules`:

> [!TIP] Also ...
> By default: path param `id` set to `simpy`

```ts {2}
const config = Record.new<IArticle>('/api/config')
    .keepBy('path:id', 'simply') // Define Rule
    // `simply` - saving by is sets or no. aka sets - *, not - null
    // `full`   - saving with value. Example: value 1, setting `id` = 1. 
    //            value true, setting `id` = true
```

### How work caching

After the request to the server, and after the templating. The system by `Rules` will store the result of the request.

Example:

```ts
const something = Record.new('/api/something/{id}')

// Do request
await something.get()

// after fetching results caching like
//  `id` = null

// Get Cache Response
something.cached({id: null})
// its returns response
// Not reactive

// if we sets id
something.pathParam('id', 1)

await something.get()

// after fetching results caching like
//  `id` = *

// And getting Cache Response
something.cached({id: '*'})
// its returns response with pathParam `id` = 1
// Not reactive
```