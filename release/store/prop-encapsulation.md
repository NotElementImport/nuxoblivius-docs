# Store - Prop (Encapsulation)

`Prop` can be `Encapsulation`, or `ReadOnly`

## `Encapsulation`
```ts
import {defineStore} from 'nuxoblivius'

class Example {
    // Encapsulation, reactive field
    public _field1: number = 0
        set field1(v: number) {
            this._field1 = v
        }
}

export default defineStore<Example>(Example)
```

`Encapsulated` field can do anything you want. 

Example with Date:
```ts
import {defineStore} from 'nuxoblivius'

class ScheduleInfo {
    // Encapsulation, reactive field
    public _startDate: string = ''
        set startDate(value: number|Date) {
            this._startDate = this.readDate(value)
        }

    // Encapsulation, reactive field
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

Read only `Prop`

```ts
import {defineStore} from 'nuxoblivius'

class Example {
    // ReadOnly, reactive field
    public _field1: number = 0
            field1: number
}

export default defineStore<Example>(Example)
```

Can be used in Auth Store

```ts
import {defineStore, Record} from 'nuxoblivius'

class AuthStore {
    // ReadOnly, reactive field
    public _token: string = ''
            token: string

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