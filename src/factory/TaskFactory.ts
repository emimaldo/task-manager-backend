interface Task {
    getTitle(): string;
  }
  
  class SimpleTask implements Task {
    constructor(private title: string) {}
    getTitle(): string {
      return this.title;
    }
  }
  
  class ComplexTask implements Task {
    constructor(private title: string) {}
    getTitle(): string {
      return `[Complex] ${this.title}`;
    }
  }
  
  export class TaskFactory {
    static createTask(type: string, title: string): Task {
      switch (type) {
        case 'simple':
          return new SimpleTask(title);
        case 'complex':
          return new ComplexTask(title);
        default:
          throw new Error('Unknown task type');
      }
    }
  }
  