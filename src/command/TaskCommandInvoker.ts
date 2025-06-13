// Command Invoker - Manages command execution and history for undo/redo
import { ICommand } from './ICommand';

export class TaskCommandInvoker {
  private history: ICommand[] = [];
  private currentIndex: number = -1;

  execute(command: ICommand): any {
    // Remove commands after current index (for redo)
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // Execute command
    const result = command.execute();
    
    // Add to history
    this.history.push(command);
    this.currentIndex++;
    
    return result;
  }

  undo(): boolean {
    if (this.currentIndex >= 0) {
      const command = this.history[this.currentIndex];
      if (command.undo) {
        command.undo();
        this.currentIndex--;
        return true;
      }
    }
    return false;
  }

  redo(): boolean {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      command.execute();
      return true;
    }
    return false;
  }

  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  getHistory(): string[] {
    return this.history.map((cmd, index) => {
      const marker = index === this.currentIndex ? ' <- current' : '';
      return `${index}: ${cmd.constructor.name}${marker}`;
    });
  }

  clearHistory(): void {
    this.history = [];
    this.currentIndex = -1;
  }
}