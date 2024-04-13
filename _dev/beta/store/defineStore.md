## Определение хранилища

Отдельное хранилище (из которых будет состоять Store всего сайта) создаётся следующим образом:

```ts
import SM, { state } from "nuxoblivius";
import Language from "./language";
import type { IPost } from '@/types/interfaces'

export default class Posts extends SM<Posts> {
	public posts = state<IPost>( [])
		.api("/api/posts")
		.template('yii2-data-provider')
		.join(Language.ref('currentAlias'))
		.joinToQuery("lang", Language.ref('currentAlias'))
		.many()

	public post = state<IPost>({})
		.api("/api/posts")
		.template('yii2-data-provider')
		.join(this.items, "slug")
		.join(Language.ref('currentAlias'))
		.joinToQuery("lang", Language.ref('currentAlias'))
		.one()
		
	constructor() {
		super("posts")
		this.manage()
	}
}
```
В данном примере был создан класс **Posts**, состоящий из 2-х объектов: *posts* и *post*. Объекты создаются функцией **state** (экспортируемой из "*nuxoblivius*"), предлагающей типизацию через Generic, а также выставление значения по умолчанию в своём аргументе. В примере продемонстрированы решения, предлагаемые state-менеджером для наиболее часто встречаемых задач.

## Формальности
Для использования всего функционала state-менеджера класс должен наследовать сущность **SM** (аббревиатура от **StateManager**), экспортируемую из "*nuxoblivius*" по умолчанию. Кроме того, внутри конструктора класса необходимо вызвать функцию **super()** с аргументом в виде любой произвольной строки (главное - уникальной в рамках сайта. Необходимо для *minify*), а также функцию this.**manage()**

## Использование

```vue
<template>
	<div class="posts">
		<div v-for="post in  posts.items.value">
			{{ post.name }}
		</div>
	</div>
</template>
<script setup lang="ts">
import Posts from '@/module/store/posts'

const posts = new Posts()

posts.items.all()
</script>
```
Подробнее: [Использование](/beta/usage.html)