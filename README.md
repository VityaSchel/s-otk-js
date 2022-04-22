# s-otk-js

Неофициальная обертка для закрытого API сайта [Самарской Объединенной Транспортной Карты](https://s-otk.ru), написанная для NodeJS.

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

### login({ username: string, password: string }): Promise<{ sessionToken, authToken, csrfToken }>

Вход в аккаунт, используя логин и пароль. Этот метод обязательно должен быть вызван перед любыми другими методами. Альтернативно, вы можете напрямую установить токен, используя свойство `credentials` на экземпляре класса SOTKAPI:

```javascript
SOTK.credentials = { token: 'zYQgRaCky9Ca9EFMTJjUNUTgkN', csrfToken: 'd2fd482bcd8a578e0dd129f25651f0d2' }
```

### getAccountInfo(): Promise<AccountInfo>

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

### getCardInfo(cardID: number): Promise<CardInfo>

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

### getCards(): Promise<Array<Card>>

Получение всех добавленных пользователем карт. Также возвращаются полезные методы, см. интерфейс Card.

### Interface Card

Карта, добавленная пользователем.

Ключ|Тип|Описание
---|---|---
number|string (cast to number)|Номер карты
getInfo|function|Метод для получения информации о карте, например баланс
getHistory|function|Метод для получения истории карты
delete|function|Метод для удаления карты из аккаунта

### addCard(cardID: number): Promise<string>

Добавление новой карты в аккаунт. См. ниже (раздел "Добавление карты (1)"), какие могут быть ответы.

### deleteCard(cardID: number): Promise<string>

Удаление новой карты из аккаунта. См. ниже (раздел "Удаление карты (2)"), какие могут быть ответы.

### getHistory(cardID: number, startDate: Date, endDate: Date): Promise<Array<HistoryOperation>>

Получение истории операций по карте, начиная с startDate и заканчивая endDate. Обновляется раз в сутки, скорее всего в полночь по Самарскому времени, но это неизвестно. 

### Interface HistoryOperation

Объект, содержащий операцию по карте.

Ключ|Тип|Описание
---|---|---
dt|string|Дата в формате "dd mm yyyy hh:mm:ss"
sum|string (cast to number)|Сумма транзакции, дробная часть отделена точкой
code|string (cast to number)|Номер маршрута
vichle|string (cast to number)|Тип поездки, полностью указаны ниже

### createInvoice(cardID: number, sum: number): Promise<formUrl: string>

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

formToken — токен который можно найти в форме на странице https://s-otk.ru/index.php/passengerlk. Сама форма генерируется на сервере и пока нет способа получить его по-другому. Скорее всгео, это должен был быть csrf-token но он не всегда совпадает с токеном в теге script в head.

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

Вернется http-код 303, если в заголовке Location видим /index.php/passengerlk и в файле куки токен, `joomla_user_state`=`logged_in` то все правильно, если нет — что-то напутали.

### Получение любой информации об аккаунте

Вся информация находится на странице https://s-otk.ru/index.php/passengerlk, там же где и вход и API-endpoint :poop:

Операции совершаются по следующему адресу: 

```
GET https://s-otk.ru/index.php/index.php?option=com_ajax&module=lkabinet&format=json
content-type: application/x-www-form-urlencoded; charset=UTF-8
```

Номер операции (ключ operation)|Описание
---|---
1|Добавление карты
2|Удаление карты
3|Получение истории поездок
4|Создание чека для инвойса для пополнения карты
5|Создание инвойса для пополнения карты, используя чек
6|Получение информации о карте

#### Получение информации о карте (6)

Для того, чтобы запросить информацию о карте, нужно сделать запрос на вышеуказанный URL с телом:

```
operation: 6
card: 100249727
[balance token]: 1
pid: [pid token]
```

balance token и pid можно найти в HTML коде страницы, внутри формы

Если карта не найдена, возвращается "\t\t\r\nОшибка запроса: ". Если найдена, то JSON следующего вида:

```json

{"success":true,"message":null,"messages":null,"data":"{\"short\":\"01234567\",\"ctg\":10,\"ctgdesc\":\"\\u041a\\u0430\\u0440\\u0442\\u0430 \\u0428\\u043a\\u043e\\u043b\\u044c\\u043d\\u0438\\u043a\\u0430\",\"balance\":\"228.12\",\"st_limit\":null,\"type\":\"EP\"}"}
```

#### Добавление карты (1)

Возвращается что-то из следующего: `Неверный номер карты`, `Карта 123456789 в базе не найдена`, `Карта 123456789 прикреплена`

#### Удаление карты (2)

Всегда возвращается "Функция базы данных сработала без ошибок", даже если карты на аккаунте нет или ее вообще не существует :unamused:

#### Получение истории поездок (3)

В теле запроса указывается дата в формате YYYY-M-D. Обратите внимание, что нулей в начале быть не должно! Даты стоит указывать в ключах startday и endday. Вернется объект с data, но data будет настоящим объектом, подробнее см. в методе getHistory.

#### Пополнение карты, генерация чека (4)

Получение ссылки для оплаты в шлюзе сбера. Обратите внимание, что после пополнения необходимо будет приложить карту к терминалу, прежде чем будет возможность пополнить снова. *интересно, что делать, если положишь меньше 16,6 рублей*

Возвращается объект следующего вида:

```json
[{"rscode":false,"rsdata":"ошибка"}]
```

Если с моментп предыдущего пополнения карта не была приложена ни к одному терминалу, в поле rsdata будет ошибка, закодированная ентити юникода (\u1234):

```
На текущий момент отложенный платеж на карту 12345678 не доступен.<br /> Предыдущая операция отложенного пополнения не завершена.<br />Для завершения операции необходимо приложить карту к любому транспортному или кассовому терминалу.<br />Следующее пополнение будет возможно после зачисления текущего платежа на карту и передачи информации о факте зачисления в систему!
```

Если же ошибок нет, то возвращается (сериализовано в data):

```json
[{"series":10,"series_desc":"\u0428\u043a\u043e\u043b\u044c\u043d\u0438\u043a, \u044d\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u043d\u044b\u0439 \u043a\u043e\u0448\u0435\u043b\u0435\u043a","min_sum":10,"company_name":"\u041e\u041e\u041e \u041e\u0422\u041a","company_inn":"\u0418\u041d\u041d 6317122520","company_address":"\u0433.\u0421\u0430\u043c\u0430\u0440\u0430, \u0443\u043b.\u0424\u0440\u0443\u043d\u0437\u0435, \u0434\u043e\u043c 70 \u044d\u0442\u0430\u0436 2\u0439 \u043a\u0430\u0431\u0438\u043d\u0435\u0442 215","company_phone":"\u0422\u043e\u043b\u044c\u044f\u0442\u0442\u0438 8(8482)24-94-48 \u0421\u0430\u043c\u0430\u0440\u0430 8(846)311-01-01","rscode":true,"sessionid":"02220422203648DA4902610000007066","tariffmaxsum":1486660,"tariffostatok":0}]
```

После чего надо вызвать подтверждение оплаты (5)

#### Пополнение карты, создание инвойса (5)

Чтобы получить URL инвойса надо вызвать операцию с кодом 5. Помимо стандартных токена, pid, operation и card в теле также надо передать: 

Ключ|Описание
---|---
tariffid|Должно быть 10
paymentsum|Сумма для пополнения, должна быть от min_sum до tariffmaxsum, полученных в пред. этапе. **Передается целым числом, в копейках!** Например 10 рублей это paymentsum=1000

Возвращается объект следующего типа  (сериализовано в data):

```json
{"errorCode":0,"errorMessage":"\u0423\u0441\u043f\u0435\u0448\u043d\u043e","formUrl":"https:\/\/securepayments.sberbank.ru\/payment\/merchants\/sbersafe_sberid\/payment_ru.html?mdOrder=[uuid]","orderId":"[uuid]"}
```

После чего перенаправляем на formUrl, где уже можно оплатить через шлюз.

## Примеры

### Вывод баланса карт

```js
import SOTKAPI from 's-otk-js'

const SOTK = new SOTKAPI()
await SOTK.login({ username: 'markov-alexey', password: '12345678' })

const cards = await SOTK.getCards()
const cardsInfo = await Promise.all(
  cards.map(card => card.getInfo())
)
console.log('Баланс ваших карт:')
cardsInfo.forEach(card => console.log(card.short + ': ' + card.balance))
```

### Вывод историй операций карт

```js
import SOTKAPI from 's-otk-js'

const SOTK = new SOTKAPI()
await SOTK.login({ username: 'bear-frede', password: '28.08.2020' })

const cards = await SOTK.getCards()
const cardsHistories = await Promise.all(
  cards.map(async card => [card.number, await card.getHistory(new Date('2022-02-22'))])
)
console.log('Истории ваших карт:')
cardsHistories.forEach(card => {
  console.log(card[0])
  console.log(card[1])
})
```

## Contributing

Не стоит.

## Licensing

[MIT](./LICENSE)