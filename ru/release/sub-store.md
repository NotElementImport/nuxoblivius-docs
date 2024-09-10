# Sub Stores

`Store` может быть `Sub Stor`-ом внутри другого `Stor`-а.

Преимущество: вложенный `Store` будет иметь доступ к свойствам родительского `Stor`-a.

Такие `Stor`-ы будут реализацией общеизвестного паттерна `Компоновщик`.

# Пример
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

`Sub Store` определяется функцией `subStore()`:
```ts
// UserInfo.ts

import {subStore, defineStore} from 'nuxoblivius'
import TNameStore from '@/stack/TNameStore'
import TCharacterisaticStore from '@/stack/TCharacterisaticStore'

class UserInfo {
    // отметим, что типизация также предусматривается
    public nameUser = subStore<TNameStore>(TNameStore)

    // Read-only
    private _characterisatic = subStore<TCharacterisaticStore>(TCharacterisaticStore)
            characterisatic: TCharacterisaticStore
}

export default defineStore<UserInfo>(UserInfo)
```

## Query-параметры из Sub Store

Одно из удобств, предлагаемых `Sub Stor`-ом: можно сформировать из всех его пар "свойство-значение" query-параметры для запроса в родительском `Stor`-е:

```ts{11}
// UserInfo.ts

import {subStore, defineStore} from 'nuxoblivius'
import TNameStore from '@/stack/TNameStore'

class UserInfo {
    // используем как Sub Store написанный ранее класс TNameStore:
    public nameUser = subStore<TNameStore>(TNameStore)

    public updateNameUser = Record.new('/api/user/update-info/name')
        // constant query 
        .query(this.ref.nameUser, true)
        // Полученные query-параметры:
        // ?firstName=Test&lastName=Testov&surName=Testovich
}

export default defineStore<UserInfo>(UserInfo)
```

## Sub Stores as Reload in Record

Можно отслеживать изменения свойств `Sub Stor`-а и перезагружать запросы с API по ним:

```ts
// UserInfo.ts

import {subStore, defineStore, later} from 'nuxoblivius'
import TNameStore from '@/stack/TNameStore'

class UserInfo {
    public nameUser = subStore<TNameStore>(TNameStore)

    public updateNameUser = Record.new('/api/user/update-info/name')
        ...
        .reloadBy(
            later(() => this.nameUser.ref.firstName) // обращаемся через ref
        )
        ...
}

export default defineStore<UserInfo>(UserInfo)
```

Функцию `later()` дополнительно используем, т.к. `Sub Store` не определён изначально (а лишь после инициализации родительского `Stor`-a).