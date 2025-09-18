# Store - Dynamic Params

Dynamic Params - in [Record](/release/records) methods, we can use Dynamic Params

If our logic not reactive, better use Dynamic Params. `() => // logic`

Some example:
```ts
import {defineStore, Record} from 'nuxoblivius'

class Example {
    private ReactiveField: string = 'important info'

    public fetchFromServer = Record.new<ISomeData>('/api/my/path')
        .query({
            // BAD
            veryImportant: this.ref._notReactiveField, 
            // GOOD
            veryImportant: () => this._notReactiveField 
        })
        .query({
            // BAD
            someParam: globalThis['my-param'],
            // GOOD
            someParam: () => 'my-param' in globalThis
                                ? globalThis['my-param']
                                : null,
            // BEST
            someParam: () => this.getMyParam()
        })
        // Another Method
        .query({
            // Worked too
            get someParam() {
                return this.getMyParam()
            },
            test: 'test'
        })

    private getMyParam() {
        return 'my-param' in globalThis
            ? globalThis['my-param']
            : null
    }
}

export default defineStore<Example>(Example)
```

# Records example all support methods

```ts
import {defineStore, Record} from 'nuxoblivius'

class Example {
    private _encapsuleReactiveField: string = 'important info'
            encapsuleReactiveField: string

    public fetchFromServer = Record.new<ISomeData>('/api/my/path')
        // 1 - Example
        .header('Content-Type', this.ref.encapsuleReactiveField)
        .header('Content-Type', () => this._encapsuleReactiveField)
        // 2 - Example
        .body(this.ref.encapsuleReactiveField)
        .body(() => this._encapsuleReactiveField)
        // 3 - Example
        .auth(this.ref.encapsuleReactiveField)
        .auth(() => this._encapsuleReactiveField)
        // 4 - Example
        .pathParam('id', this.ref.encapsuleReactiveField)
        .pathParam('id', () => this._encapsuleReactiveField)
        // 5 - Example
        .reloadBy(later() => this.subStore.ref.someVal)
        .reloadBy(this.ref.encapsuleReactiveField)
        .reloadBy(() => this._encapsuleReactiveField)
}

export default defineStore<Example>(Example)
```