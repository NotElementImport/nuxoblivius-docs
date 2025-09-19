# State Manager

**Nuxoblivius** включает встроенный _State Manager_, обеспечивающий удобное управление состоянием приложения.

Основой являются классы, что позволяет строить гибкую и расширяемую архитектуру, а также легко интегрировать собственные механизмы работы с данными.

## Создание _Store_ объекта

**Nuxoblivius** поддерживает два подхода к созданию _Store_:

- **[`Singleton`](https://refactoring.guru/ru/design-patterns/singleton)** — единый экземпляр состояния, доступный во всём приложении.

- **[`Factory`](https://refactoring.guru/ru/design-patterns/factory-method)** — генерация новых экземпляров _Store_ при каждом вызове.

### Как работает создание _Store_:

— Все свойства класса, кроме начинающихся с `_`, автоматически становятся **реактивными**.\
— _Store_ реализован на базе классов, поэтому вы можете использовать все привычные возможности _ООП_: **наследование**, **инкапсуляцию**, **полиморфизм**.

### Factory (через `subStore`/`defineFactory`):

Более безопасный вариант, при котором _Store_ создаётся в контексте конкретного компонента.

> — Такой _Store_ изолирован и уничтожается вместе с компонентом; \
> — Поддерживает хуки жизненного цикла ([`onMounted`](https://vuejs.org/api/composition-api-lifecycle.html#onmounted), [`onUnmounted`](https://vuejs.org/api/composition-api-lifecycle.html#onunmounted)) во **Vue 3**; \
> — Удобен для локального состояния, которое не должно «_утекать_» за пределы компонента;

::: code-group

```ts [Бизнес логика (subStore)] {15}
import { subStore } from "nuxoblivius";

class Counter {
  private value: number = 0;

  public getValue(): number {
    return this.value;
  }

  public increase(): void {
    this.value += 1;
  }
}

export default () => subStore(Counter);
```

```ts [Бизнес логика (defineFactory)] {15}
import { defineFactory } from "nuxoblivius";

class Counter {
  private value: number = 0;

  public getValue(): number {
    return this.value;
  }

  public increase(): void {
    this.value += 1;
  }
}

export default defineFactory(Counter);
```

```vue [Отображение]
<script setup lang="ts">
import useCounter from "@/store/Counter";

const counter = useCounter();
</script>
<template>
  <button @click="counter.increase()">Counter: {{ counter.getValue() }}</button>
</template>
```

:::

### Singleton (через `defineStore` / `defineSingleton`):

**Singleton** используется тогда, когда нужно иметь единый источник правды во всём приложении.
_Store_, созданный через `defineStore`/`defineSingleton`, существует в одном экземпляре и доступен из любой части кода.

_Зачем это нужно_:

> — хранение **глобального состояния**, которое должно быть одинаковым для всех компонентов; \
> — управление _настройками приложения_ (**тема**, **язык**, **конфигурация**); \
> — хранение _данных пользователя_ (**сессия**, **токен**, **профиль**); \
> — кэширование или другие данные, которые не должны пересоздаваться при каждом обращении;

::: code-group

```ts [Бизнес логика (defineStore)] {15}
import { defineStore } from "nuxoblivius";

class Counter {
  private value: number = 0;

  public getValue(): number {
    return this.value;
  }

  public increase(): void {
    this.value += 1;
  }
}

export default defineStore(Counter);
```

```ts [Бизнес логика (defineSingleton)] {15}
import { defineSingleton } from "nuxoblivius";

class Counter {
  private value: number = 0;

  public getValue(): number {
    return this.value;
  }

  public increase(): void {
    this.value += 1;
  }
}

export default defineSingleton(Counter);
```

```vue [Отображение]
<script setup lang="ts">
import Counter from "@/store/Counter";
</script>
<template>
  <button @click="Counter.increase()">Counter: {{ Counter.getValue() }}</button>
</template>
```

:::

## Инкапсуляция данных

**Nuxoblivius** поддерживает разные подходы к инкапсуляции состояния:

> — **Классический _ООП_-подход** — вы можете скрывать данные за приватными свойствами и методами;

> — **Встроенные механизмы библиотеки** — **Nuxoblivius** позволяет ограничивать доступ к данным через специальные методы и правила реактивности, сохраняя при этом контроль над изменением состояния.

Таким образом, можно сочетать привычные средства инкапсуляции из _ООП_ с возможностями, встроенными в сам фреймворк.

### Классический подход (getter/setter):

Классический подход строится через: _методы доступа_

::: code-group

```ts [Бизнес логика]
import { subStore } from "nuxoblivius";

class Language {
  private currentLanguage: string;

  public getCurrent(): string {
    return this.currentLanguage;
  }

  public setCurrent(lang: string): void {
    this.currentLanguage = lang;
  }
}

export default () => subStore(Language);
```

```ts [Пример использования]
import useLanguage from "@/store/Language";

const language = useLanguage();

language.setCurrent("ru");
language.getCurrent(); // ru
```

:::

### Теневая переменная (Метод двойного свойства):

::: warning ⚠ Важно
Доступно только для примитивных объектов (**строка**, **число**, **булевое**, **объект**)
:::

В **Nuxoblivius** используется механизм теневых переменных, позволяющий отделять внутреннее состояние от публичного.

> — Свойство с префиксом `_` считается внутренним — оно доступно только _внутри класса_ и не участвует в реактивности напрямую.

> — Свойство без префикса создаётся как «_зеркало_» внутреннего и используется для внешнего доступа.

Таким образом, данные хранятся безопасно внутри объекта, а снаружи доступны только через контролируемый интерфейс. Это сочетает привычную инкапсуляцию из _ООП_ с _реактивной моделью_ **Nuxoblivius**.

::: code-group

```ts [Бизнес логика]
import { subStore } from "nuxoblivius";

class Info {
  private _message: string; // Теневая перемменая, внутренняя
  readonly message!: string; // Открытая наружная

  public setMessage(newMessage: string): void {
    this._message = newMessage;
  }
}

export default () => subStore(Info);
```

```ts [Пример использования]
import useInfo from "@/store/Info";

const info = useInfo();
info.setMessage("Hello world!");

info.message; // Hello world!
```

:::

### Кастомный setter (Свойство которое может себя модернизировать)

В **Nuxoblivius** используется механизм методы доступа теневых переменных, позволяющий отделять внутреннее состояние от публичного а так-же его кастомизировать.

> — Свойство с префиксом `_` считается внутренним — оно доступно только _внутри класса_ и не участвует в реактивности напрямую.

> — Свойство без префикса создаётся как «_зеркало_» внутреннего и используется для внешнего доступа. Оно является методом доступа `set` и позволяет модифицировать входные данные.

::: code-group

```ts [Бизнес логика]
import { subStore } from "nuxoblivius";

class OTPValue {
  private _value: string;
  set value(value: unknown) {
    const valueAsString = `${value}`;

    if (valueAsString.lenght > 8) {
      this._value = valueAsString.slice(1, 8);
      return;
    }

    this._value = valueAsString;
  }
}

export default () => subStore(OTPValue);
```

```ts [Пример использования]
import useOTPValue from "@/store/OTPValue";

const otp = useOTPValue();
otp.value = "1020202";
otp.value; // 020202
```

:::

## Низкоуровневый доступ (.ref)

У любого _Store_ в **Nuxoblivius** есть специальное свойство `.ref`.
Оно предоставляет низкоуровневый доступ к экземпляру класса, из которого был создан _Store_.

Зачем это может быть нужно:

> — Получение информации, о свойсве (**Название**, **Значение**);

> — Подписать/Отписаться от изменений;

::: code-group

```ts [Бизнес логика]
import { subStore } from "nuxoblivius";

class TestStore {
  public myVar: string;
}

export default () => subStore(TestStore);
```

```ts [Пример использования]
import useTestStore from "@/store/TestStore";

const testStore = useTestStore();

testStore.ref.myVar.name; // "myVar"
testStore.ref.myVar.value; // undefined

testStore.myVar = "Hello!";

testStore.ref.myVar.value; // "Hello!"

const unWatchHandle = testStore.ref.myVar.watch(() => {
  console.log("Value updated!");
}, "some-key");

testStore.ref.myVar.unwatch("some-key");
```

:::

## ⚡ Event: Создан

После сборки методами `defineStore` или `subStore` вызывается событие `mounted`. В соответствующей функции можно произвести желаемые действия:

```ts
import { defineStore } from "nuxoblivius";

class Test {
  mounted() {
    console.log("Я собран!");
  }
}

export default defineStore(Test);
```

## API

### `defineStore`

```ts
interface Store<T> {
    ref: Record<keyof T, { value: any, watch(handle: Function): void }>
}

declare function defineStore<T extends any>(class: { new(): T }): T & Store<T>
```

### `subStore`

```ts
interface Store<T> {
    ref: Record<keyof T, { value: any, watch(handle: Function): void }>
}

declare function subStore<T extends any>(class: { new(): T }): T & Store<T>
```
