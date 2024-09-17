# Store - Инкапсуляция свойств

Свойство может быть, по желанию, `инкапсулировано`:

## `Инкапсуляция`
```ts
import {defineStore} from 'nuxoblivius'

class Example {
    // Инкапсулированное, реактивное свойство
    public _field1: number = 0
        set field1(v: number) {
            this._field1 = v
        }
}

export default defineStore<Example>(Example)
```

Весь функционал для свойства остаётся прежним.

Пример:
```ts
import {defineStore} from 'nuxoblivius'

class ScheduleInfo {
    public _startDate: string = ''
        set startDate(value: number|Date) {
            this._startDate = this.readDate(value)
        }

    public _endDate: string = ''
        set endDate(value: number|Date) {
            this._endDate = this.readDate(value)
        }

    private readDate(value: number|Date) {
        const date: Date = typeof value == 'number'
                            ? new Date(value)
                            : value

        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }

    public convertToQuery() {
        return `start_date=${this.startDate}&end_Date=${this.endDate}`
    }
}

export default defineStore<ScheduleInfo>(ScheduleInfo)
```

## `ReadOnly`

`Свойство` можно сделать доступным только для чтения:

```ts
import {defineStore} from 'nuxoblivius'

class Example {
    // Реактивное свойство, доступное только для чтения
    public _field1: number = 0
            field1: number
}

export default defineStore<Example>(Example)
```

Пример:
```ts
import {defineStore, Record} from 'nuxoblivius'

class AuthStore {
    // Делаем токен доступным только для чтения:
    public _token: string = ''
            token: string

    // ответ запроса авторизации сделаем нереактивным, т.к. используем единожды
    private _loginAPI = Record.new('/api/login')

    public async login(username: string, password: string) {
        const response = await this._loginAPI.post({
                username,
                password
            })

        if('token' in response) {
            this._token = response.token
            return true;
        }
        else {
            return false;
        }
    }
}

export default defineStore<AuthStore>(AuthStore)
```