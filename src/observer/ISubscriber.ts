// Observer Pattern - Subscriber Interface
// Defines the contract for objects that want to be notified of task events

export interface ISubscriber {
  update(task: any): void;
}
