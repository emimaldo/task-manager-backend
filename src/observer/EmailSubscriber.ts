// Observer Pattern - Email Subscriber Implementation
// Concrete subscriber that simulates sending email notifications

import { ISubscriber } from './ISubscriber';

export class EmailSubscriber implements ISubscriber {
  constructor(private email: string) {}

  update(task: any): void {
    console.log(`📧 Email sent to ${this.email}: New task "${task.getTitle()}" has been created`);
  }

  getEmail(): string {
    return this.email;
  }
}
