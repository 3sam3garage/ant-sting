## Description

_Ant-sting_ is a project aimed at assisting with investments in financial assets

## Installation

```bash
$ npm install
```

## Running the app

- Ant-sting includes 3 applications
  - api
  - batch
  - consumer

```bash
$ npm run start:api
$ npm run start:batch
$ npm run start:consumer
```

## Recommended Steps to run daily batch

1. **scrape** economic-information. (consumer required)

```bash
$ npm run start:batch:economic-inforamtion:scrape-naver
```
```bash
$ npm run start:batch:economic-inforamtion:scrape-kcif
```

2. **analyze** economic-information.

```bash
$ npm run start:batch:economic-inforamtion:analyze
```

3. **scrape** stock-information. (consumer required)

```bash
$ npm run start:batch:stock:scrape
```

4. send notification.

```bash
$ npm run start:batch:notification
```

[//]: # '## Support'
[//]: # "Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support)."

## Monthly (or terms that are over month) batch

- update company's stock code

```bash
$ npm run start:batch:corporation:update-id
```

- update company's financial statement

```bash
$ npm run start:batch:corporation:financial-statement
```

## Stay in touch

- Author - [3sam3]()
- Blog - [https://iamdap91.github.io](https://iamdap91.github.io/)

## License

Nest is [MIT licensed](LICENSE).
