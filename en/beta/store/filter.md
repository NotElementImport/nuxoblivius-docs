## Filter
Для определения полной логики фильтра тех или иных получаемых с api данных необходимо создать класс следующим образом:
```ts
import Filter from 'nuxoblivius/filter';

export default class FilterSchedule extends Filter {
	protected static globalName = 'FilterSchedule'
	protected setup () {
		this.createFilter({
				'doctor_id':  this.type.string(),
				'length':  this.type.string(),
				'time_start':  this.type.string(),
				'time_end':  this.type.string()
			})
		this.setDefault({
			doctor_id:  '-1',
			length:  '30'
		})
		this.setPrefix('filter[', ']')
	}
}
```
Импортируемый по умолчанию из "nuxoblivius/filter" класс Filter предоставляет следующие функции:
 - **createFilter** ({ *Object* }) - функция, определяющая параметры фильтра. Здесь также нужно осуществить и типизацию параметров.
 - **setDefault** ({ *Object* }) - функция для записи значений параметров фильтра по умолчанию
 - **setPrefix** (start: *string*, end: *string*) - функция, позволяющая установить префикс и суффикс ко всем параметрам фильтра (чтобы не дублировать их написание много раз).
 
Данной логики достаточно для работы фильтра, если он будет работать по принципу *emit-always* - т.е., по сути, нужно лишь дописывать нужные query-параметры в api-запросах. Непосредственно же фильтрацию будет осуществлять backend.

В случае локальной фильтрации в классе фильтра необходимо создать функцию **resolve** (el: *Element*), по возвращаемому значению которой (*true* / *false*) и будет определяться, "отсекается" элемент, или нет. Простейший пример:
```ts
export default class FilterScheduleLocal extends Filter {

protected static globalName = 'FilterScheduleLocal'
	protected resolve(el: ISchedule) {
		return Boolean(el.free)
	}
}
```
Объект state-менеджера использует класс фильтра следующим образом:
```ts
public schedules = state<IDoctorSchedule>([])
	.api("/api/doctor/schedule")
	.auth(Auth.ref('token'))
	.template('my-data')
	.filter(FilterSchedule.ref(), 'emit-always')
```