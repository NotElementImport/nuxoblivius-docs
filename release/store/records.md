# Store - Records

`Records` is Fetching to API, and get data

[Record](/release/records) is independent object, who had one static method `new`, which create `Record` to work with data from API 


Definition in store:
```ts
import {defineStore, Record} from 'nuxoblivius'

class Example {
    public fetchFromServer = Record.new<ISomeData>('/api/my/path')
}

export default defineStore<Example>(Example)
```

## More 

More information in [Record](/release/records)