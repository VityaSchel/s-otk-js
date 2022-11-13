## Документация

Внимание! Некоторые методы здесь могут иметь устаревшую сигнатуру. Лучше ориентируйтесь по тайпингам в TypeScript, они всегда актуальные.

### login({ username: string, password: string }): Promise\<{ sessionToken, authToken, csrfToken }\>

Вход в аккаунт, используя логин и пароль. Этот метод обязательно должен быть вызван перед любыми другими методами. Альтернативно, вы можете напрямую установить токен, используя свойство `credentials` на экземпляре класса SOTKAPI:

```javascript
SOTK.credentials = { 
  token: 'zYQgRaCky9Ca9EFMTJjUNUTgkN', 
  authToken: 'HGrpB9KWRnRRNKrsY8jdfvesBl75xb5D',
  csrfToken: 'd2fd482bcd8a578e0dd129f25651f0d2' 
}
```

### logout(): Promise

Удаление сессии. После этого рекомендуется не использовать экземпляр вообще или после повторного входа вызвать getAccountInfo.

### getAccountInfo(): Promise\<AccountInfo\>

Этот метод используется внутри других методов и скорее всего никогда не понадобится вам. Он нужен лишь для того, чтобы обновить информацию об аккаунте для таких методов, как, например, getCards. Он вызывается один раз и после чего результат кешируется в свойстве `accountInfo` в экземпляре класса. Если вы хотите обновить информацию для других методов, например поездки, его стоит вызвать следующим образом:

```javascript
await SOTK.getAccountInfo()
```

Также он может понадобиться для получения некоторых токенов и информации из HTML-кода страницы аккаунта, подробнее смотрите в интерфейсе AccountInfo.

### Interface AccountInfo

Ключ|Тип|Описание
---|---|---
root|node-html-parser:HTMLElement|Корень страницы
balance|object\<token, pid\>|Токены для запроса баланса
delCard|object\<token, pid\>|
addCard|object\<token, pid\>|
history|object\<token, pid\>|

### getCardInfo(cardID: number): Promise\<CardInfo\>

Получение информации о карте, используя её номер (напечатан на обратной стороне). Если карта не найдена, метод завершается ошибкой "Card ID not found".

### Interface CardInfo

Объект с информацией про проездную карту

Ключ|Тип|Описание
---|---|---
short|string (cast to number)|Строка с номером карты, может содержать нули в начале
ctg|number|Неизвестно
ctgdesc|string|Описание, например "Карта Школьника"
balance|string (cast to number)|Строка, содержащая баланс карты, дробная часть отделяется точкой
st_limit|null|Неизвестно
type|string|Неизвестно

### getCards(): Promise\<Array\<Card\>\>

Получение всех добавленных пользователем карт. Также возвращаются полезные методы, см. интерфейс Card.

### Interface Card

Карта, добавленная пользователем.

Ключ|Тип|Описание
---|---|---
number|string (cast to number)|Номер карты
getInfo|function|Метод для получения информации о карте, например баланс
getHistory|function|Метод для получения истории карты
delete|function|Метод для удаления карты из аккаунта

### addCard(cardID: number): Promise\<string\>

Добавление новой карты в аккаунт. См. ниже (раздел "Добавление карты (1)"), какие могут быть ответы.

### deleteCard(cardID: number): Promise\<string\>

Удаление новой карты из аккаунта. См. ниже (раздел "Удаление карты (2)"), какие могут быть ответы.

### getHistory(cardID: number, startDate: Date, endDate: Date): Promise\<Array\<HistoryOperation\>\>

Получение истории операций по карте, начиная с startDate и заканчивая endDate. Обновляется раз в сутки, скорее всего в полночь по Самарскому времени, но это неизвестно. 

### Interface HistoryOperation

Объект, содержащий операцию по карте.

Ключ|Тип|Описание
---|---|---
dt|string|Дата в формате "dd mm yyyy hh:mm:ss"
sum|string (cast to number)|Сумма транзакции, дробная часть отделена точкой
code|string (cast to number)|Номер маршрута
vichle|string (cast to number)|Тип поездки, полностью указаны ниже

### createInvoice(cardID: number, sum: number): Promise\<formUrl: string\>

Создание инвойса для пополнения карты, возвращается formURL, который можно открыть в браузере для оплаты в шлюзе сбербанка.

**sum должен быть в копейках, например 10 рублей это sum=1000**

### Типы поездок

Экспортировано из https://s-otk.ru/modules/mod_lkabinet/js/main.js

```js
vichles[103456789]="Метро";
vichles[203456789]="Троллейбус";
vichles[303456789]="Трамвай";
vichles[403456789]="Автобус гор.";
vichles[603456789]="Автобус обл.";
vichles[803456789]="Поезд";
```

### **static** passwordRecovery(email, gCaptchaResponse): Promise

**Для вызова метода требуется ввод капчи пользователем**

(todo)

### register(name: string, username: string, email: string, password: string): Promise

**Для вызова метода требуется ввод капчи пользователем**

(todo)

Пример ссылки, приходящей на почту:

`https://s-otk.ru/index.php/registration?task=registration.activate&token=(случайный токен вида /^[a-f0-9]{32})$/`

*Возможно этот токен — это просто хеш md5 чего-нибудь, я не знаю, чего можно ожидать от ОТК* 😂