
## Динамические параметры

Как уже показано в примерах - все функции могут принимать в себя как статические, так и динамические параметры:

```ts {9,12,15}
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

При этом запрос к api не будет осуществляться при изменениях динамического параметра автоматически. Для реактивности запросов к api используется функция [reloadBy](/release/records.html#reloadby)
