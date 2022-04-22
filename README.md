# s-otk-js

Неофициальная обертка для закрытого API сайта Самарской Объединенной Транспортной Карты, написанная для NodeJS.

## Установка

```
npm i s-otk-js
```

## Использование

```javascript
import SOTKAPI from 's-otk-js'

const SOTK = new SOTKAPI()
await SOTK.login({ username, password })
```

## Документация

### login({ username: string, password: string }): Promise

Вход в аккаунт, используя логин и пароль. Этот метод обязательно должен быть вызван перед любыми другими методами. Альтернативно, вы можете напрямую установить токен, используя свойство `credentials` на экземпляре класса SOTKAPI:

```javascript
SOTK.credentials = { token: 'd2fd482bcd8a578e0dd129f25651f0d2' }
```

## Коллекция Postman

Для удобства я также создал коллекцию в Postman: <https://www.getpostman.com/collections/62ef370751fdab25a1d1>

## Немного про обратную разработку

Эту библиотку я делал по аналогии с [asurso](https://npmjs.com/package/asurso): захватываем запросы с сайта и переносим в js. Поскольку сайт шаблонный и сделан на каком-то стареньком движке PHP (пожалуйста, возьмите меня на работу), не составило большого труда реализовать процесс входа и выполнения действий.

**Важно!** Сайт защищен с помощью Cloudflare. Кстати, для гос. компаний это запрещено законом, но мы сделаем вид что так и надо. Для нас важно то, что спамить запросами не стоит, а брутфорс пароля скорее всего невозможен.

csrfToken — токен для защиты от cross-site-request-forgery атак, его можно найти в теге `<script type="application/json" class="joomla-script-options loaded">` в head на любой странице. *Да, сайт сделан на джумле....* Внутри тега будет json-конструкция следующего вида: `{"csrf.token":"[32 символа, a-f0-9]","system.paths":{"root":"","base":""},"system.keepalive":{"interval":540000,"uri":"\/index.php\/component\/ajax\/?format=json"}}`

Токен сессии создается при первом входе на сайт, с его помощью мы авторизируемся и делаем действия. Его ключ, судя по всему, всегда такой: `fb60ded04faae990cc1fc4ed1921fc75`

### Вход

```
POST https://s-otk.ru/index.php/passengerlk
content-type: application/x-www-form-urlencoded
```

Ключ|Описание
---|---
username|Имя пользователя
password|Пароль в чистом виде
remember|on или off, влияет на то вернется ли куки httpOnly с сессией
option|должен быть com_users
task|должен быть user.login
return|хз
[formToken]|должен быть 1

formToken — токен который можно найти в форме на странице https://s-otk.ru/index.php/passengerlk. Сама форма генерируется на сервере и пока нет способа получить его по-другому. Скорее всгео, это должен был быть csrf-token но он не совпадает с токеном в теге script в head.

Пример:
```
username: vityaschel
password: pythonsucks228
remember: on
option: com_users
task: user.login
return: aW5kZXgucGhwP0l0ZW1pZD0xMTk=
653c2cb89d31dd41d2c0a7e1f326fdd1: 1
```

Вернется http-код 303, если в заголовке Location видим https://s-otk.ru/index.php/passengerlk и в файле куки токен, то все правильно, если нет — что-то напутали.

