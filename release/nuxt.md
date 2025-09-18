# Настройка Nuxt

Данный пакет нативно поддерживает Nuxt 3

В `nuxt.config.ts` нужно прописать два поля:
```ts
export default defineNuxtConfig({
    ...
    modules: [
        'nuxoblivius/nuxt', // Подключаем модуль
    ],

    nuxoblivius: {
        logs: true, // Включает логи SSR запросов
        rules: {
            // Для SSR можно настроить. Подстройку URL запроса
            // И только для SSR
            // '/api/post' => 'http://my-api/post'
            '/api': 'http://my-api'
        }
    },
    ...
})
```

## SSR

Запросы в Nuxt на уровне сервера производятся стандартным `fetch`-ем под обалочкой `useAsyncData`.

## Pipeline

Nuxoblivius старается сделать удобной разработку вашего приложения. Для лучшего понимания всего происходящего распишем Pipeline для Nuxt:

<h4> Запуск Nuxt </h4>

Запускается модуль `'nuxoblivius/nuxt'`, делающий необходимые настройки для взаимодействия Nuxt-ом и обозначающий о своём присуствии.

<h4> Запрос с клиента </h4>

Nuxoblivius создаёт uid подключения для логов.

<h4> Вызовы Record (fetching data) </h4>

Nuxoblivius делает запрос через useAsyncData.

<h4> Отправка страницы клиенту (SSR Rendering) </h4>

Nuxoblivius очищает все данные после запроса.

<!-- ## Возможные проблемы -->