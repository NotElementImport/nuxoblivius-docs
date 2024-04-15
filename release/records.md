# Records

`Records` is the object that is requested by the api

::: warning
Still
:::

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

We can put a Sub Store in the Query, read more [here](/release/sub-store.html#sub-stores-as-query)

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

## Method POST

## Method PUT

## Method DELETE

## Reactive Response