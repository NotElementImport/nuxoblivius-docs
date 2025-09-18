## Filter

Для определения полной логики фильтра тех или иных получаемых с api данных необходимо создать класс следующим образом:

```ts
import Filter from "nuxoblivius/filter";

export default class FilterFilms extends Filter {
  protected static globalName = "FilterFilms";
  protected setup() {
    this.createFilter({
      name: this.type.string(),
      category: this.type.array(),
      rating: this.type.number(),
      hideNsfw: this.type.boolean(),
    });
    this.setDefault({
      rating: 5,
    });
    this.setPrefix("filter[", "]");
  }
}
```

Импортируемый по умолчанию из "nuxoblivius/filter" класс Filter предоставляет следующие функции:

- **createFilter** ({ _Object_ }) - функция, определяющая параметры фильтра. Здесь также нужно осуществить и типизацию параметров.
- **setDefault** ({ _Object_ }) - функция для записи значений параметров фильтра по умолчанию
- **setPrefix** (start: _string_, end: _string_) - функция, позволяющая установить префикс и суффикс ко всем параметрам фильтра (чтобы не дублировать их написание много раз).

Данной логики достаточно для работы фильтра, если он будет работать по принципу _emit-always_ - т.е., по сути, нужно лишь дописывать нужные query-параметры в api-запросах. Непосредственно же фильтрацию будет осуществлять backend.

В случае локальной фильтрации в классе фильтра необходимо создать функцию **resolve** (el: _Element_), по возвращаемому значению которой (_true_ / _false_) и будет определяться, "отсекается" элемент, или нет. Простейший пример:

```ts
export default class FilterPostLocal extends Filter {
  protected static globalName = "FilterFilmsLocal";
  protected resolve(el: IPostResponse) {
    return Boolean(el.nsfw == true); // Hide it
  }
}
```

Объект state-менеджера использует класс фильтра следующим образом:

```ts
public schedules = state<IDoctorSchedule>([])
	.api("/api/films")
	.template('my-template')
	.filter(FilterPost.ref(), 'emit-always')
```
