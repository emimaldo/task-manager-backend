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

class PersonalTask implements Task {
  constructor(private title: string) {}
  getTitle(): string {
    return `[Personal] ${this.title}`;
  }
}

class WorkTask implements Task {
  constructor(private title: string) {}
  getTitle(): string {
    return `[Work] ${this.title}`;
  }
}

class GeneralTask implements Task {
  constructor(private title: string) {}
  getTitle(): string {
    return this.title;
  }
}

export class TaskFactory {
  static createTask(type: string, title: string): Task {
    switch (type.toLowerCase()) {
      case 'simple':
        return new SimpleTask(title);
      case 'complex':
        return new ComplexTask(title);
      case 'personal':
        return new PersonalTask(title);
      case 'work':
        return new WorkTask(title);
      default:
        // For unknown types, create a general task instead of throwing
        return new GeneralTask(title);
    }
  }
}
  