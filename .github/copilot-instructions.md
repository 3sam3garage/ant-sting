# AI Assistant Instructions for This Repository

This document provides guidelines for an AI assistant to effectively contribute to this project. Adhering to these instructions is crucial for maintaining code quality and architectural integrity.

## 1. Project Overview

This is a NestJS monorepo application designed for aggregating and processing financial data from various sources. Key functions include scraping SEC filings from RSS feeds, polling market data, and analyzing economic information.

- **Key Technologies**: NestJS, TypeScript, Docker, Jest, ESLint, Prettier
- **Structure**: NestJS monorepo (`apps` and `libs`).

## 2. Core Architectural Principles: Clean Architecture

This project strictly follows the **Clean Architecture** pattern. The most critical rule is **The Dependency Rule**: source code dependencies must only point inwards.

The layers are structured as follows:

1.  **`libs/domain` (Entities - Innermost)**
    *   **Contains**: Core business entities (e.g., `Portfolio`, `EconomicInformation`), value objects, and repository abstractions (typically `abstract class` which act as both an interface and a DI token).
    *   **Rules**: The domain layer should be kept as pure as possible, with minimal framework-specific code. It defines the contracts for the outer layers.

2.  **`libs/application` (Use Cases)**
    *   **Contains**: Application-specific business logic (Use Cases/Interactors, e.g., `ScrapeRssUseCase`).
    *   **Rules**: Depends only on the `domain` layer. It orchestrates data flow by using the repository abstractions defined in the domain. It knows nothing about the database or web frameworks.

3.  **`libs/infrastructure` (Frameworks & Drivers)**
    *   **Contains**: Concrete implementations for repository abstractions (e.g., `PortfolioMongoRepository`), clients for external APIs, database connection logic (`mongo`, `redis`), etc.
    *   **Rules**: Implements the abstractions from the `domain` layer. This is where all external tools and frameworks are handled.

4.  **`apps/*` (Presentation - Outermost)**
    *   **Contains**: Entry points to the application (e.g., NestJS controllers, cron jobs, CLI commands, message consumers).
    *   **Rules**: This is the composition root. It wires the layers together using NestJS Dependency Injection. The code here should be "thin" — its primary job is to receive requests, call a use case from the `application` layer, and present the result.

**Architectural Violation**: Never import from `infrastructure` or `apps` into the `application` or `domain` layers.

## 3. Development Workflow & Conventions

- **Monorepo Structure**: Code is organized into `apps` (runnable applications) and `libs` (shared libraries). New generic logic should go into a `lib`.
- **NestJS First**: Utilize NestJS features and conventions. Use the CLI (`nest g module|service|...`) to scaffold new components.
- **Dependency Injection**: Always use NestJS's DI container to provide dependencies. Inject use cases into controllers/jobs, and inject repository abstractions into use cases.
- **Configuration**: All configuration is managed in the `libs/config` library. Use the `ConfigService` to access environment variables.
- **Coding Style**: This project uses ESLint and Prettier. Ensure all code is formatted and linted before committing.
- **Naming**:
    - Modules: `*.module.ts`
    - Services/Use Cases: `*.service.ts` / `*.use-case.ts`
    - Controllers/Jobs: `*.controller.ts` / `*.job.ts`
    - Repository Abstractions: `*.repository.impl.ts`

## 4. Testing

- **Write Tests**: All new features, bug fixes, or refactors must be accompanied by unit or integration tests.
- **Framework**: Tests are written using the **Jest** framework.
- **Location**: Test files (`*.spec.ts` or `*.test.ts`) are co-located with the source code they are testing.
- **Execution**: Run tests with `npm run test`.

## 5. Commits & Pull Requests

- **Commit Messages**: Write clear, descriptive commit messages that explain the "why" behind the change.
- **Pull Requests**: Follow the template provided in `.github/PULL_REQUEST_TEMPLATE.md`.

## 6. Think and Infer in English, and Answer in Korean