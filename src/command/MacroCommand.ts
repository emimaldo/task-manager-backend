// Command Pattern - Macro Command Implementation
// Executes multiple commands as a single unit with proper undo support

import { ICommand } from './ICommand';

export class MacroCommand implements ICommand {
  private commands: ICommand[] = [];

  constructor(commands: ICommand[]) {
    this.commands = commands;
  }

  execute(): any {
    const results: any[] = [];
    this.commands.forEach(command => {
      results.push(command.execute());
    });
    return results;
  }

  undo(): void {
    // Undo in reverse order
    for (let i = this.commands.length - 1; i >= 0; i--) {
      if (this.commands[i].undo) {
        this.commands[i].undo!();
      }
    }
  }

  addCommand(command: ICommand): void {
    this.commands.push(command);
  }

  getCommandCount(): number {
    return this.commands.length;
  }

  clear(): void {
    this.commands = [];
  }
}
