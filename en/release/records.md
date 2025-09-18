# Records

`Records` is the object that is requested by the api

## Define
For define `Records` need use this struct 

```ts{6}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class UserInfo {
    public getUserInfo = Record.new<IUserInfo>('/api/user/info')
}

export default defineStore<UserInfo>(UserInfo)
```

## Query

For working with API, sometimes need set Query params use `query()`:

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

In query we can do from none reactive items to dynamic items example get info from `globalThis`, use `() =>`

```ts{9}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class UserInfo {
    public getUserInfo = Record.new<IUserInfo>('/api/user/info')
        // GOOD but not BEST practice
        .query({
            'my-param': () => 'param' in globalThis ? globalThis.param : null
        })
}

export default defineStore<UserInfo>(UserInfo)
```

And in query we can put reactive items like

```ts{11}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class UserInfo {
    public myValue: number = 0

    public getUserInfo = Record.new<IUserInfo>('/api/user/info')
        .query({
            // Ref to create Reference to this variable
            'my-param': this.ref.myValue
        })
}

export default defineStore<UserInfo>(UserInfo)
```

You can also clear out all the queries

```ts
myRecordObject.clearDynamicQuery()
```

We can put a Sub Store in the Query, read more [here](/release/sub-store.html#sub-stores-as-query)

Also can read a [Dynamic Params in  Query](/release/store/dynamic-params.html)

## Path Params

`Records` support Path Params in request path, example param in path: `/api/user/get/{id}`

Example in Store:
```ts{9}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public idUser: number = 0

    public getUser = Record.new<IUser>('/api/user/get/{id}')
        .pathParam('id', this.ref.idUser)

    // Result: /api/user/get/0
    // Is idUser equals null
    // Then
    // Result: /api/user/get/
}

export default defineStore<User>(User)
```

They also supported [Dynamic Params](/release/store/dynamic-params.html)

## Headers

`Records` support customize Headers:

Example:
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

## Authorization

`Records` support authorization in requests:

Example:
```ts{7}
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public getUser = Record.new<IUser>('/api/user/get/{id}')
        .auth('Baerer as|asd%120_xcas1oa7x6')
}

export default defineStore<User>(User)
```

In `Records` had helpful methods for work with Authorization:

```ts
// UserInfo.ts

import {defineStore, Record} from 'nuxoblivius'

class User {
    public getUser = Record.new<IUser>('/api/user/get/{id}')
        .auth(Record.Bearer('as|asd%120_xcas1oa7x6'))
        // or
        .auth(Record.Basic('login', 'password'))
}

export default defineStore<User>(User)
```

They also supported [Dynamic Params](/release/store/dynamic-params.html)

## Body

To work with body of request, use `body()`

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

## Method GET

To call Query, using `get()`, `post()`, `put()`, `delete()`

`get()` - Working as `method: 'get'` in options

Had 1 argument `id`, who work as [path param](/release/records.html#path-params)

```ts
// Example
record.get() // Without argument
record.get(1) // With argument
// or
record.get('1') // With argument

// Example await
// Not reactive
const result = await record.get()
```

## Method POST

`post()` - Working as `method: 'post'` in options

Had 1 argument `body`, who work as [path param](/release/records.html#body)

```ts
// Example
record.post() // Without argument

// JSON
record.post({'my': 'json'})
// or
// FormData
const formData = new FormData()
formData.append('my', 'formData')
record.post(formData)

// Example await
// Not reactive
const result = await record.post()
```

## Method PUT


`put()` - Working as `method: 'put'` in options

Had 1 argument `body`, who work as [path param](/release/records.html#body)

```ts
// Example
record.put() // Without argument

// JSON
record.put({'my': 'json'})
// or
// FormData
const formData = new FormData()
formData.append('my', 'formData')
record.put(formData)

// Example await
// Not reactive
const result = await record.put()
```

## Method DELETE

```ts
// Example
record.delete() // Without argument
record.delete(1) // With argument
// or
record.delete('1') // With argument

// Example await
// Not reactive
const result = await record.delete()
```

## Reactive Response

Records have a reactive `response` property. 

```vue
<script setup lang='ts'>
...
myStore.record.get()
...
</script>
<template>
    <!-- Reactive response, SSR friendly -->
    {{ myStore.record.response }}
</template>
```

## Response Headers

After the query, you can access the headers

```ts
myStore.record.headers.get('Content-Type')
```

## Errors

It's handy to see errors and identify

```ts
myStore.record.get()

if(myStore.record.error)
    console.log('Something wrong', myStore.record.errorText)
```

## Is Fetching

Indicates whether a request to the server is in progress

```ts
console.log(
    myStore.record.loading
)
```

## Blob Type

You can put the type of the received data blob

```ts
record.isBlob(true)
```