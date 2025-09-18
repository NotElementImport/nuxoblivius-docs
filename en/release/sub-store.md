# Sub Stores

`Store` can be like Sub Stores for Another Stores

## Basics
Base using of Sub Store for extends functionality another Store

Example Sub Store class:
```ts
// TNameStore.ts

export class TNameStore {
    private _firstName: string = ''
            firstName: string
            
    private _lastName: string = ''
            lastName: string

    private _surName: string = ''
            surName: string
}
```

To define Sub Store in another Store, use function `subStore()`
```ts
// UserInfo.ts

import {subStore, defineStore} from 'nuxoblivius'
import TNameStore from '@/stack/TNameStore'
import TCharacterisaticStore from '@/stack/TCharacterisaticStore'

class UserInfo {
    public nameUser = subStore<TNameStore>(TNameStore)

    // and Read only

    private _characterisatic = subStore<TCharacterisaticStore>(TCharacterisaticStore)
            characterisatic: TCharacterisaticStore
}

export default defineStore<UserInfo>(UserInfo)
```

## Sub Stores as Query

One of the interesting features of Sub Stores is working with queries in Records

```ts{11}
// UserInfo.ts

import {subStore, defineStore} from 'nuxoblivius'
import TNameStore from '@/stack/TNameStore'

class UserInfo {
    public nameUser = subStore<TNameStore>(TNameStore)

    public updateNameUser = Record.new('/api/user/update-info/name')
        // constant query 
        .query(this.ref.nameUser, true)
        // Example rendered query: 
        // ?firstName=Test&lastName=Testov&surName=Testovic
}

export default defineStore<UserInfo>(UserInfo)
```

## Sub Stores as Reload in Record

If need track changes in Sub Store and pushing some Query again, use this struct

```ts
// UserInfo.ts

import {subStore, defineStore, later} from 'nuxoblivius'
import TNameStore from '@/stack/TNameStore'

class UserInfo {
    public nameUser = subStore<TNameStore>(TNameStore)

    public updateNameUser = Record.new('/api/user/update-info/name')
        ...
        // ERROR
        .reloadBy(
            this.nameUser.ref.firstName
        )
        // GOOD
        .reloadBy(
            later(() => this.nameUser.ref.firstName)
        )
        ...
}

export default defineStore<UserInfo>(UserInfo)
```

Sub Stores not defined from start, then use struct `later()`, which later proccesed