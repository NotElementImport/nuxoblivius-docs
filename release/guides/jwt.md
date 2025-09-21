# Гайды / Работа с JWT

В этом разделе рассмотрим, как правильно работать с **JWT** (_access/refresh_ токенами) в **Nuxoblivius**.
Мы разберём, как:

> - не привязываться жёстко к таймаутам _access_-токена;

> - автоматически обновлять access при его истечении;

> - настраивать запросы так, чтобы даже при ошибках они корректно выполнялись;

> - сделать всё это без проблем в **SSR**.

## Основная идея

Вместо того чтобы полагаться на фиксированный таймер истечения токена, лучше отлавливать **реальный ответ сервера**.
Если _access_ оказался просрочен, запрос автоматически прерывается и запускается процесс получения нового access через _refresh_.

После обновления токена:

> 1. исходный запрос повторяется;

> 2. пользователь продолжает работать без разрыва сессии.

## Подготовка

Для работы с **JWT** создадим отдельный стор **AuthService**, в котором будут два основных запроса:

> - `login` — авторизация пользователя и получение _access/refresh_ токенов;

> - `refresh` — обновление _access_ токена при его истечении.

```ts
import { defineSingleton, Record, SetDefaultAuth } from "nuxoblivius";

class AuthService {
  private _accessToken?: string;
  private _refreshToken?: string;

  private _loginRecord = Record.new("/api/login", {})
    .header("Content-Type", "application/json")
    .onFailure(() => {});

  private _refreshRecord = Record.new("/api/refresh", {})
    .header("Content-Type", "application/json")
    .onFailure(() => {});

  public getAccessToken(): string {
    return this._accessToken;
  }

  public async login(loginForm: object) {
    const responseData = await this._loginRecord.post(loginForm);

    if (this._loginRecord.error) {
      return new Error("Uncorrect credentials");
    }

    this._accessToken = responseData.access;
    this._refreshToken = responseData.refresh;

    SetDefaultAuth(Record.Bearer(this._accessToken));
  }

  public async refresh() {
    if (!this._refreshToken) {
      throw new Error("User not logined");
    }

    const responseData = await this._refreshRecord.post({
      refreshToken: this._refreshToken,
    });

    if (this._refreshRecord.error) {
      return new Error("Failed to refresh auth");
    }

    this._accessToken = responseData.access;
    this._refreshToken = responseData.refresh;

    SetDefaultAuth(Record.Bearer(this._accessToken));
  }
}

export default defineSingleton(AuthService);
```

## Настройка глобального `.onFailure()` хука

В **Nuxoblivius** можно настроить глобальный перехват ошибок, чтобы одинаково обрабатывать их для всех запросов.
Это особенно полезно при работе с _JWT_.

Самый частый сценарий — перехват `401 Unauthorized`.
В этом случае мы можем:

> 1. Проверить, есть ли у нас _refresh_ токен.

> 2. Если есть — выполнить запрос обновления.

> 3. После успешного обновления — повторить исходный запрос.

Таким образом, пользователю не придётся вручную перелогиниваться, если _access_ токен истёк.

Для этого используется функция `SetRequestFailure()`.
Она работает аналогично `.onFailure()`, но применяется ко всем запросам в приложении.

::: code-group

```ts [Без прерывания всех запросов]
import { SetRequestFailure } from "nuxoblivius";
import AuthService from "@/stores/AuthStore";

SetRequestFailure(async (info, retry) => {
  // Проверяем, что ошибка — это 401
  if (info.code === 401) {
    // Пытаемся обновить токен
    await AuthService.refresh();

    // После успешного обновления пробуем запрос заново
    return retry();
  }
});
```

```ts [С прерыванием всех запросов]
import { SetRequestFailure, tryAbortAllRequest } from "nuxoblivius";
import AuthService from "@/stores/AuthStore";

SetRequestFailure(async (info, retry) => {
  // Проверяем, что ошибка — это 401
  if (info.code === 401 || info.abortCode === 401) {
    // Прерываем все запросы
    tryAbortAllRequest(401);

    // Пытаемся обновить токен
    await AuthService.refresh();

    // После успешного обновления пробуем запрос заново
    return retry();
  }
});
```

:::

## Итого

Глобальный `.onFailure()` хук через `SetRequestFailure()` позволяет централизованно обрабатывать ошибки всех запросов.
Наиболее полезный сценарий — это автоматическое обновление _access_ токена при получении статуса `401`.
В этом случае мы проверяем наличие _refresh_ токена, выполняем обновление, и повторяем запрос заново.
