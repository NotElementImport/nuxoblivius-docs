# Гайды / Работа с DI

В этом разделе описано, как интегрировать **Nuxoblivius** с контейнерами зависимостей (_DI_).
Для примера мы будем использовать популярный контейнер [`Inversify`](https://inversify.io/).

## 1. Подготовка

Перед началом работы с **Nuxoblivius** и интеграцией с _DI_ необходимо выполнить базовую настройку проекта.

**Установите зависимости**

```bash
npm install nuxoblivius inversify
```

**Инициализация контейнера**

```ts
import { Container } from "inversify";

const container = new Container();
```

## 2. Создание UserService

Создадим сервис, который будет хранить и управлять данными пользователя.
Он будет зарегистрирован как _singleton_, чтобы одно состояние переиспользовалось во всём приложении.

::: code-group

```ts [Через subStore]
import { subStore } from "nuxoblivius";

interface IUser {
  id: number;
  name: string;
}

export class UserService {
  private user?: IUser;

  public setUser(user: IUser): void {
    this.user = user;
  }

  public getUser(): IUser {
    if (!this.user) {
      throw new Error("User is empty");
    }

    return this.user;
  }

  public isLoggedIn(): boolean {
    return this.user !== null;
  }
}

export const useUserService = () => subStore(UserService);
```

```ts [Через defineFactory]
import { defineFactory } from "nuxoblivius";

interface IUser {
  id: number;
  name: string;
}

export class UserService {
  private user?: IUser;

  public setUser(user: IUser): void {
    this.user = user;
  }

  public getUser(): IUser {
    if (!this.user) {
      throw new Error("User is empty");
    }

    return this.user;
  }

  public isLoggedIn(): boolean {
    return this.user !== null;
  }
}

export const useUserService = defineFactory(UserService);
```

:::

## 3. Регистрация UserService

Добавляем **UserService** в _DI_-контейнер:

```ts {6-9}
import { Container } from "inversify";
import { UserService, useUserService } from "@/service/UserService";

export const container = new Container();

container
  .bind(UserService)
  .toDynamicValue(() => useUserService())
  .inSingletonScope();
```

## 4. Внедрение зависимостей

После регистрации сервисов и стора в контейнере, их можно внедрять (инъектировать) в другие классы.

::: code-group

```ts [Через subStore] {7-8,21}
import { subStore, Record } from "nuxoblivius";
import type { UserService } from "@/service/UserService";

export class PostService {
  private posts = Record.new("/api/posts", []);

  // Добавляем зависимость как аргумент
  constructor(private userService: UserService) {}

  async getUserPosts() {
    if (!this.userService.isLoggedIn()) {
      throw new Error("User is not loggined");
    }

    const user = this.userService.getUser();

    return await this.posts.query({ userId: user.id }).get();
  }
}

export const usePostService = (userSerivce: UserService) = subStore(PostService, userService);
```

```ts [Через defineFactory] {7-8}
import { defineFactory, Record } from "nuxoblivius";
import type { UserService } from "@/service/UserService";

export class PostService {
  private posts = Record.new("/api/posts", []);

  // Добавляем зависимость как аргумент
  constructor(private userService: UserService) {}

  async getUserPosts() {
    if (!this.userService.isLoggedIn()) {
      throw new Error("User is not loggined");
    }

    const user = this.userService.getUser();

    return await this.posts.query({ userId: user.id }).get();
  }
}

export const usePostService = defineFactory(PostService);
```

:::

Так-же регистрация в контейнере:

```ts {12-18}
import { Container } from "inversify";
import { UserService, useUserService } from "@/service/UserService";
import { PostService, usePostService } from "@/service/PostService";

export const container = new Container();

container
  .bind(UserService)
  .toDynamicValue(() => useUserService())
  .inSingletonScope();

container.
  .bind(PostService)
  .toDynamicValue(() => usePostService(
    // Подключаем зависимость
    container.get<UserService>(UserService)
  ))
  .inSingletonScope();
```

## 5. Внедренние в Vue Файл

Внедрение работает через контейнер, так-же как и в примерах выше.

```vue
<script setup lang="ts">
import { container } from "@/config/di";
import { PostService } from "@/service/PostService";

const postService = container.get<PostService>(PostService);

const userPosts = await postService.getUserPosts();
</script>
<template>
  {{ userPosts }}
</template>
```

## Итого

Во фронтенде _DI_ используют реже, чем в бэкенде, но он реально даёт плюсы, особенно если проект крупный и модульный. Вот основные плюсы:

1. **Ослабленная связность (Loose Coupling)**

   > Компоненты и сервисы не знают, кто именно создаёт их зависимости. Они просто описывают «мне нужен **UserService**», а контейнер уже решает, какую реализацию дать. Это снижает «_спагетти-зависимости_» в коде.

2. **Лёгкое тестирование**

   > С _DI_ можно в контейнер подложить мок или фейковую реализацию.Например, вместо настоящего **ApiService** в тестах используется **FakeApiService**, и код компонента менять не нужно.

3. **Гибкая замена реализаций**

   > Если сервис меняется (например, **LocalStorageAuthService** -> **JwtAuthService**), то компоненты этого не замечают: достаточно переназначить биндинг в контейнере.

4. **Управление жизненным циклом**

   > _DI_ позволяет контролировать:
   >
   > - _singleton_ (один на всё приложение),
   > - _transient_ (новый объект при каждом запросе),
   > - _scoped_ (на сессию, на страницу и т.д.). Это полезно для сторов, кэшей, сервисов пользователя.

5. **Единый подход к управлению состоянием**

   > _DI_-контейнер можно использовать как центральный реестр сервисов:
   >
   > - UserService (данные пользователя)
   > - ApiService (работа с запросами)
   > - ThemeService (тема интерфейса)
   >
   > Вместо глобальных переменных/хаков — всё под контролем.

6. **Удобная интеграция в архитектуре (_Clean/FSD/MVVM_)**
   > _DI_ отлично ложится в архитектурные подходы:
   >
   > - _View_ → _Store_ → _Service_ → _Record (API)_
   >
   > Компонент просто запрашивает Store/Service из контейнера и не думает, «_как он создаётся_».

**В итоге**:

- В маленьких проектах _DI_ может быть избыточен.
- В средних и больших фронтенд-проектах _DI_ упрощает тестирование, модульность и рефакторинг.
