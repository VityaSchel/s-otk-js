# s-otk-js

Неофициальная обертка для закрытого API сайта [Самарской Объединенной Транспортной Карты](https://s-otk.ru), написанная для NodeJS.

![TypeScript logo](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white&label=%D0%95%D1%81%D1%82%D1%8C%20%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B0)

![Jest Logo](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white&label=%D0%90%D0%B2%D1%82%D0%BE-%D1%82%D0%B5%D1%81%D1%82%D1%8B%20%D1%81)

![Coverage](https://img.shields.io/badge/85.15%25-181818?style=for-the-badge&label=%D0%9F%D0%BE%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D1%82%D0%B5%D1%81%D1%82%D0%B0%D0%BC%D0%B8:)

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

Вы можете найти ее здесь: [docs/REFERENCE.md](./docs/REFERENCE.md)

## Коллекция Postman

Для удобства я также создал коллекцию в Postman: <https://www.getpostman.com/collections/62ef370751fdab25a1d1>

## Немного про обратную разработку

Вы можете почитать здесь: [docs/INFO.md](./docs/INFO.md)

## Примеры

Вы можете найти примеры в директории [examples/](./examples/README.md)

## Contributing

Лучше задонатьте мне:)

## Funding

[hloth.dev/donate](https://hloth.dev/donate)

## License

[MIT](./LICENSE.md)