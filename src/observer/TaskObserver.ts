interface Subscriber {
    update(task: any): void;
  }
  
  class ConsoleSubscriber implements Subscriber {
    update(task: any): void {
      console.log('Subscriber notified:', task.getTitle());
    }
  }
  
  export class TaskObserver {
    private subscribers: Subscriber[] = [new ConsoleSubscriber()];
  
    notify(task: any) {
      for (const sub of this.subscribers) {
        sub.update(task);
      }
    }
  }
  