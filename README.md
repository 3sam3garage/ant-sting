# Ant-Sting

## Description

_Ant-sting_ is a comprehensive financial data aggregation and analysis platform. It automatically collects data from various sources, including SEC filings (13F-HR), economic news from Naver Finance and the Korea Center for International Finance (KCIF), and trending prediction markets from PolyMarket. The collected data is then processed, analyzed (utilizing AI for insights), and used to generate reports and notifications.

## Architecture

This project is built upon the principles of **Clean Architecture**. This design pattern enforces a strict separation of concerns and ensures that the core business logic (Domain) is independent of frameworks and external details. The fundamental rule is the **Dependency Rule**: source code dependencies can only point inwards, from outer layers to inner layers.

The layers are organized as follows:

1.  **Domain (`libs/domain`)**: The innermost layer containing core business entities, value objects, and repository interfaces. It is the heart of the application and has no external dependencies.
2.  **Application (`libs/application`)**: Contains the application-specific business logic (Use Cases). It orchestrates the flow of data by using the repository interfaces defined in the Domain layer.
3.  **Infrastructure (`libs/infrastructure`)**: Provides concrete implementations for the interfaces defined in the inner layers. This includes database repositories (MongoDB), external API clients (SEC, Naver, Slack), browser automation (Puppeteer), and AI services (Google Gemini).
4.  **Presentation (`apps/*`)**: The outermost layer, containing the entry points to the application. This includes NestJS controllers, cron jobs (`agent`), CLI commands (`batch`), and message queue consumers (`consumer`). This layer is responsible for composing the application and handling user/system interactions.

## Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Architecture**: Clean Architecture
- **Database**: MongoDB (with TypeORM)
- **In-Memory Store**: Redis (for caching and message queues)
- **Message Queue**: Bull
- **Web Scraping**: Puppeteer
- **AI**: Google Gemini
- **Containerization**: Docker

## Project Structure

The project is a NestJS monorepo, organized into two main directories:
- `apps/`: Contains the runnable applications (entry points).
- `libs/`: Contains shared libraries organized by architectural layers (`domain`, `application`, `infrastructure`, `shared`).

## Installation

```bash
$ npm install
```

```bash
# Install browser for puppeteer
$ npx puppeteer browsers install chrome@stable
```

## Running the Applications

_Ant-sting_ consists of three main applications:

- **`agent`**: A standalone application that runs scheduled tasks (cron jobs). Its primary role is to periodically scrape the SEC RSS feed for new 13F-HR filings and add them to a processing queue.
- **`batch`**: A command-line interface (CLI) application for executing on-demand batch jobs. This is used for various data scraping and processing tasks.
- **`consumer`**: A microservice that listens to message queues (e.g., for analyzing SEC filings or processing economic data) and performs the corresponding tasks.

```bash
# Run the agent for scheduled jobs
$ npm run start:agent

# Run the consumer to process queued jobs
$ npm run start:consumer

# Run batch commands (see below for available commands)
$ npm run start:batch -- [COMMAND]
```

## Batch Commands

### Scraping Economic Information

```bash
# Scrape Naver Finance
$ nest start batch -- economic-information scrape-naver

# Scrape Korea Center for International Finance (KCIF)
$ nest start batch -- economic-information scrape-kcif

# Analyze collected economic information
$ nest start batch -- economic-information analyze
```

### Scraping SEC Filings

```bash
# (POC) Scrape SEC 13F-HR RSS feed
$ nest start batch -- poc scrape-rss

# (POC) Process a specific 13F-HR filing
$ nest start batch -- poc sec-13f
```

### Scraping PolyMarket

```bash
# Scrape trending polls from PolyMarket
$ nest start batch -- poly-market poll
```

## Container Registry
- [ant-sting-batch](https://hub.docker.com/r/iamdap91/ant-sting-batch)
- [ant-sting-consumer](https://hub.docker.com/r/iamdap91/ant-sting-consumer)
- [ant-sting-agent](https://hub.docker.com/r/iamdap91/ant-sting-agent)

## Stay in touch

- Author - [3sam3]()
- Blog - [https://iamdap91.github.io](https://iamdap91.github.io/)

## License

[MIT licensed](LICENSE).