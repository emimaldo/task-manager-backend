# Task Manager Backend

A professional task management backend built with **Node.js**, **Express**, and **TypeScript**. This project demonstrates multiple design patterns with comprehensive unit and integration testing using **Jest**.

## 🚀 Features

- **RESTful API** for task management (CRUD operations)
- **Design Patterns** implementation with full test coverage
- **TypeScript** for type safety and better development experience
- **Jest Testing** with 91 comprehensive tests
- **Error Handling** and validation
- **Concurrent Request** support

## 🏗️ Architecture & Design Patterns

### **Behavioral Patterns**
- **Observer Pattern**: Event-driven task notifications with multiple subscribers
- **Command Pattern**: Encapsulated task operations with undo functionality

### **Structural Patterns**  
- **Adapter Pattern**: External service integration with consistent interfaces
- **Decorator Pattern**: Dynamic task feature enhancement

### **Creational Patterns**
- **Factory Pattern**: Task creation based on type
- **Singleton Pattern**: Centralized repository management

## 📁 Project Structure

```
src/
├── server.ts                 # Application entry point
├── routes/                   # API endpoints
│   └── tasks.ts             # Task CRUD routes
├── models/                   # Data models
│   └── TaskModel.ts         # Task entity definition
├── interfaces/               # Contracts and interfaces
│   └── ITaskRepository.ts   # Repository interface
├── repository/               # Data access layer
│   ├── InMemoryTaskRepository.ts
│   └── TaskRepositorySingleton.ts
├── observer/                 # Observer Pattern
│   ├── TaskObserver.ts      # Subject implementation
│   ├── ConsoleSubscriber.ts # Console notifications
│   ├── EmailSubscriber.ts   # Email notifications
│   └── DatabaseLoggerSubscriber.ts
├── adapter/                  # Adapter Pattern
│   ├── ILogger.ts           # Logger interface
│   ├── LoggerAdapter.ts     # External logger adapter
│   ├── ConsoleLoggerAdapter.ts
│   └── FileLoggerAdapter.ts
├── command/                  # Command Pattern
│   ├── ICommand.ts          # Command interface
│   ├── CreateTaskCommand.ts # Task creation command
│   ├── UpdateTaskCommand.ts # Task update command
│   ├── DeleteTaskCommand.ts # Task deletion command
│   └── TaskCommandInvoker.ts
├── decorator/                # Decorator Pattern
│   ├── DecoratedTask.ts     # Base interface
│   ├── BaseTask.ts          # Concrete task
│   ├── PriorityDecorator.ts # Priority enhancement
│   ├── DeadlineDecorator.ts # Deadline management
│   └── NotificationDecorator.ts
└── factory/                  # Factory Pattern
    └── TaskFactory.ts       # Task creation factory

tests/
├── setup.js                 # Test environment configuration
├── unit/                    # Unit tests (75 tests)
│   ├── observer.test.ts     # Observer pattern tests (25)
│   ├── adapter.test.ts      # Adapter pattern tests (25)
│   ├── decorator.test.ts    # Decorator pattern tests (25)
│   └── command.test.ts      # Command pattern tests (16)
└── integration/             # Integration tests (16 tests)
    └── task-manager.test.ts # Full API testing
```

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
