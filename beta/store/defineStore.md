## Определение хранилища

Отдельное хранилище (из которых будет состоять Store всего сайта) создаётся следующим образом:

```ts
import SM, { state } from "nuxoblivius";
import Language from "./language";
import type { IPost } from "@/types/interfaces";

export default class Posts extends SM<Posts> {
  public posts = state<IPost>([])
    .api("/api/posts")
    .template("yii2-data-provider")
    .joinToQuery("lang", Language.ref("current"))
    .many();

  public post = state<IPost>({})
    .api("/api/posts")
    .template("yii2-data-provider")
    .joinToQuery("lang", Language.ref("current"))
    .one();

  constructor() {
    super("posts");
    this.manage();
  }
}
```

В данном примере был создан класс **Posts**, состоящий из 2-х объектов: _posts_ и _post_. Объекты создаются функцией **state** (экспортируемой из "_nuxoblivius_"), предлагающей типизацию через Generic, а также выставление значения по умолчанию в своём аргументе. В примере продемонстрированы решения, предлагаемые state-менеджером для наиболее часто встречаемых задач.

## Формальности

Для использования всего функционала state-менеджера класс должен наследовать сущность **SM** (аббревиатура от **StateManager**), экспортируемую из "_nuxoblivius_" по умолчанию. Кроме того, внутри конструктора класса необходимо вызвать функцию **super()** с аргументом в виде любой произвольной строки (главное - уникальной в рамках сайта. Необходимо для _minify_), а также функцию this.**manage()**

## Использование

```vue
<template>
  <div class="posts">
    <div v-for="post in posts.items.value">
      {{ post.name }}
    </div>
  </div>
</template>
<script setup lang="ts">
import Posts from "@/module/store/posts";

const posts = new Posts();

posts.items.all();
</script>
```

Подробнее: [Использование](/beta/usage.html)
