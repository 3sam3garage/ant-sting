# Copilot Instructions for Ant-Sting Project

This document provides guidelines for using GitHub Copilot in this project. Adhering to these instructions will help maintain code quality, consistency, and alignment with the project's architecture.

## 1. Understand the Project Structure

This is a monorepo using NestJS. The structure is divided into `apps` and `libs`:

-   **`apps`**: Contains the main applications (`agent`, `batch`, `consumer`). These are the entry points of our services.
-   **`libs`**: Contains shared libraries used across the applications. Before writing new code, check if a suitable function or module already exists in `libs`.

## 2. Follow Existing Code Conventions

-   **Language**: The entire codebase is in TypeScript. Use modern TypeScript features where appropriate.
-   **Framework**: This project uses the [NestJS](https://nestjs.com/) framework. Follow NestJS conventions for creating modules, services, controllers, and providers.
-   **Style**: Adhere to the existing coding style, formatting (Prettier), and naming conventions. Look at the surrounding code for examples.
-   **Imports**: Use absolute paths for imports from `libs` (e.g., `import { MyService } from '@app/common'`).

## 3. Dependencies

-   Before adding a new dependency, check if a similar functionality is already provided by an existing library in the `libs` folder or in `package.json`.
-   Use the existing libraries for common tasks:
    -   `@app/config`: For application configuration.
    -   `@app/common`: For shared utilities.
    -   `@app/domain-mongo`: For MongoDB domain entities and repositories.
    -   `@app/domain-redis`: For Redis-based data storage.
    -   `@app/external-api`: For communication with external APIs.

## 4. Testing

-   When adding new features, also add corresponding tests.
-   Look at existing `./spec/*.spec.ts` files to understand the testing style and conventions.

## 5. Commit Messages

-   Follow the conventional commit format for your commit messages. Example: `feat(consumer): add new feature`.

By following these guidelines, you can help ensure that Copilot's suggestions are aligned with the project's standards.
