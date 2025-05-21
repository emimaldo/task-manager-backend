# Task Manager Backend

This is the backend part of the Task Manager project. It is built using **Node.js**, **Express**, and **TypeScript**. It demonstrates the use of behavioral, structural, and creational design patterns.

## Project Structure

- `src/patterns/observer/` – Implements the Observer pattern.
- `src/patterns/adapter/` – Implements the Adapter pattern.
- `src/patterns/factory/` – Implements the Factory Method pattern.
- `src/server.ts` – Entry point of the application.

## Scripts

```bash
npm run dev       # Run in development mode (with nodemon)
npm start         # Run the app
```

## Install

```bash
npm install
```

## Requirements

- Node.js >= 18
- TypeScript
- ts-node

## Design Patterns Used

- **Observer**: For event subscriptions.
- **Adapter**: To adapt an external logging service.
- **Factory Method**: To create different types of tasks.
