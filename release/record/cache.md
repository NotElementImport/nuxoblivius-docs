# Record (Запросы API) / Кэширование <Badge text="^ 1.1.0" style='margin-top: 13px;'/>

::: tip В разработке

Данный раздел всё ещё дорабатывается

:::

Для одного `Record`-а может быть вызвана функция получения данных ([GET](/release/records.html#get), [POST](/release/records.html#post), [функции пагинации](/release/records.html#пагинация), и т.д.) многократно (причём с различными [path-параметрами](/release/records.html#path-параметры), в том числе может и без параметров).

[Response](/release/records.html#response) (если не активна функция [appendsResponse](/release/records.html#appendsresponse)) хранит в себе (что логично) лишь последнее полученное значение с API.

При этом предыдущие значения не стираются с памяти, а сохраняются в `кэше`. Кэш хранит в себе данные в виде пар "тег: response" - т.е. к каждому respons-у сооветствует `тег` в качестве идентификатора.

При необходимости сборки кэша теги нужно настроить функцией `createTag`:

## createTag

```ts {2,7,11}
const article = Record.new<IArticle>("/api/article/{id}").createTag(
  "path:id",
  "full",
); // Определение тегов для данного Record
// Теги по path-параметру. Т.е. id (часть после двоеточия 1-го аргумента) будет браться из path-параметра (часть перед двоеточием).
// `full` - означает, что запись в кэше будет сохраняться для каждого уникального значения тега 'path:id'
// Или:
const article = Record.new<IArticle>("/api/article/{id}").createTag(
  "path:id",
  "simply",
); // Определение тегов для данного Record
// `simply` - означает, что записи для кэша будут сохраняться по принципу "был указан параметр, или нет". Т.е. будут сохранены 2 записи.
// Или:
const articles = Record.new<IArticle>("/api/article").createTag(
  "query:page",
  "full",
); // Определение тегов для данного Record
// Теги по query-параметру 'page'.
// `full` - будут идентифицироваться все записи для каждого конкретного 'query:page'
```

1-й аргумент функции - строка вида `path:${somePathParam}` либо `query:${someQueryParam}`. Часть перед двоеточием определяет, записи будут кэшироваться по path-параметру, или же по query-параметру (2 варианта). Часть после двоеточия - название самого параметра.

2-й аргумент функции:

- `simply` (default) - при нём в кэше будут сохранены только 2 возможные записи по принципу: был ли указан данный параметр, или же нет.
- `full` - записи будут кэшироваться для каждого уникального значения указанного в 1-м аргументе параметра.

Для доступа непосредственно к данным из кэша используется функция `cached`:

## cached

```ts
Articles.article.cached({ id: 5 }); // запись с тегом `id: 5` (id как из path-параметра, так и из query будут равнозначны)

Articles.article.cached({ id: null }); // запись при неуказанном id

Articles.article.cached({ id: "*" }); // последняя запись при каком-либо выставленном id, не равном null
```

Тут отметим, что при повторной записи данных в Record для одинакового тега, доступен будет только последний из них. Кэш сохраняет только последнюю запись для конкретного тега.

Для 3-го примера выше, к примеру, в кэше будет доступен только последний из всех response-ов для произвольных id.

## Примеры использования

```ts
class Articles {
  articles = Record.new<IArticle>("/api/article").createTag(
    "query:page",
    "full",
  ); // теги - query-параметры 'page'
  // 'full' - сохраняем response каждой страницы (query:page)
}

await Articles.articles.query({ page: 1 }).get();

await Articles.articles.query({ page: 2 }).get();

await Articles.articles.query({ page: 3 }).get();

console.log(Articles.articles.cached({ page: 1 })); // доступна 1-я страница статей
console.log(Articles.articles.cached({ page: 2 })); // доступна 2-я страница статей
console.log(Articles.articles.cached({ page: 3 })); // 3-я (актуальная) страница статей
console.log(Articles.articles.response); // лог, аналогичный предыдущему
console.log(Articles.articles.cached({ page: "*" })); // лог, также аналогичный двум предыдущим - последний response статей при любом указанном page

await Articles.articles.get(); // не указали page

console.log(Articles.articles.cached({ page: null })); // response статей при неуказанном page
console.log(Articles.articles.cached({ page: "*" })); // лог, аналогичный первым 5-и:  response статей при любом page, не равном null
console.log(Articles.articles.cached({ page: 4 })); // undefined

await Articles.articles.query({ id: 5 }).get(); // снова указали page, но указали другой параметр

console.log(Articles.articles.cached({ page: null })); // результат последнего запроса. Т.к. как раз в нём page не был указан (был указан другой параметр, id)
console.log(Articles.articles.cached({ page: 5 })); // undefined
```

```ts
class Articles {
  article = Record.new<IArticle>("/api/article/{id}").createTag(
    "path:id",
    "simply",
  ); // теги - path-параметры 'id'
  // 'simply' - сохраняем только 2 записи в кэше по принципу "Был ли выставлен 'path:slug', или нет"
}

await Articles.article.pathParam("id", 2).get();
await Articles.article.pathParam("id", 3).get();
await Articles.article.pathParam("id", 4).get();

console.log(Articles.articles.cached({ id: 2 }));
console.log(Articles.articles.cached({ id: 3 }));
console.log(Articles.articles.cached({ id: 4 }));
console.log(Articles.articles.cached({ id: 5 }));
console.log(Articles.articles.cached({ id: "*" })); // все 5 вышеперечисленных лога вернут последний response при указанном любом id
console.log(Articles.articles.cached({ id: null })); // undefined, т.к. запроса при НЕуказанном id не осуществлялось

await Articles.article.get(); // не указали id

console.log(Articles.articles.cached({ id: null })); // теперь данный лог вернёт результат последнего запроса - при нём id не был указан
```
