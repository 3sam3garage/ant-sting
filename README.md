## Description

_Ant-sting_ is a project aimed at assisting with investments in financial assets

## Installation

```bash
$ npm install
```

## Running the app

- Ant-sting includes 4 applications
  - api
  - batch
  - consumer
  - agent

```bash
$ npm run start:api
$ npm run start:batch
$ npm run start:consumer
$ npm run start:agent
```

## Batch Jobs

### Scraping Stock Reports

```bash
$ nest start batch -- stock-report scrape-naver
```

```bash
$ nest start batch -- stock-report scrape-hana
```

```bash
$ nest start batch -- stock-report scrape-shinhan
```

```bash
$ nest start batch -- stock-report scrape-kiwoom
```

### Scraping Economic Information

```bash
$ nest start batch -- economic-information scrape-naver
```

```bash
$ nest start batch -- economic-information scrape-kcif
```

```bash
$ nest start batch -- economic-information exchange-rate
```

```bash
$ nest start batch -- economic-information bond-yield
```

```bash
$ nest start batch -- economic-information interest-rate
```

```bash
$ nest start batch -- economic-information stock-index
```

```bash
$ nest start batch -- economic-information analyze
```

### Scraping SEC

```bash
$ nest start batch -- stock scrape-sec-ticker
```

```bash
$ nest start batch -- stock scrape-rss
```

### Testing

```bash
$ nest start batch -- test test2
```

## Stay in touch

- Author - [3sam3]()
- Blog - [https://iamdap91.github.io](https://iamdap91.github.io/)

## License

[MIT licensed](LICENSE).
