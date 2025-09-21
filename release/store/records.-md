# Store - Records

`Record`-ы (записи) - объекты для работы с данными, подгружаемыми с API, предлагающие множество полезных функций и свойств для удобства работы.

[Record](/release/records) имеет над собой единственный метод - `new` - ожидающий в аргументе ссылку на API:

```ts
import {defineStore, Record} from 'nuxoblivius'

class Example {
    public fetchFromServer = Record.new<ISomeData>('/api/my/path', [])
}

export default defineStore<Example>(Example)
```
, а также 2-м аргументом можно указать начальное значение свойства.

Как и обычные свойства, `Record`-ы могут быть приватными либо публичными.

## Подробнее

Подробно обо всех возможностях [Record](/release/records) - в соответствующем разделе. 