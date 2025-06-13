// Command Pattern Tests - Design Pattern Implementation Validation
// Tests the Command pattern functionality with undo/redo and macro commands

import {
  CreateTaskCommand,
  DeleteTaskCommand,
  UpdateTaskCommand,
  TaskCommandInvoker,
  MacroCommand,
  CommandFactory
} from '../../src/command';
import { TaskObserver } from '../../src/observer';
import { InMemoryTaskRepository } from '../../src/repository/InMemoryTaskRepository';

// Mock console.log to capture output for testing
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

describe('Command Pattern', () => {
  let repository: InMemoryTaskRepository;
  let observer: TaskObserver;
  let invoker: TaskCommandInvoker;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    observer = new TaskObserver();
    invoker = new TaskCommandInvoker();
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  describe('CreateTaskCommand', () => {
    test('should create and save a task', () => {
      const command = new CreateTaskCommand('Test Task', 'simple', repository, observer);
      const result = command.execute();
      
      expect(result).toBeDefined();
      expect(result.title).toBe('Test Task');
      expect(result.type).toBe('simple');
      expect(repository.findAll()).toHaveLength(1);
    });

    test('should notify observers when task is created', () => {
      const command = new CreateTaskCommand('Observed Task', 'complex', repository, observer);
      command.execute();
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('📢 Task notification: [Complex] Observed Task')
      );
    });

    test('should support undo operation', () => {
      const command = new CreateTaskCommand('Undo Task', 'simple', repository, observer);
      const result = command.execute();
      
      expect(repository.findAll()).toHaveLength(1);
      
      command.undo();
      
      expect(repository.findAll()).toHaveLength(0);
      expect(mockConsoleLog).toHaveBeenCalledWith(`Undoing task creation: ${result.id}`);
    });
  });

  describe('DeleteTaskCommand', () => {
    test('should delete an existing task', () => {
      // First create a task
      const createCommand = new CreateTaskCommand('Task to Delete', 'simple', repository, observer);
      const createdTask = createCommand.execute();
      
      // Then delete it
      const deleteCommand = new DeleteTaskCommand(createdTask.id, repository);
      const result = deleteCommand.execute();
      
      expect(result).toBe(true);
      expect(repository.findAll()).toHaveLength(0);
    });

    test('should support undo to restore deleted task', () => {
      // Create and delete a task
      const createCommand = new CreateTaskCommand('Deletable Task', 'simple', repository, observer);
      const createdTask = createCommand.execute();
      
      const deleteCommand = new DeleteTaskCommand(createdTask.id, repository);
      deleteCommand.execute();
      
      expect(repository.findAll()).toHaveLength(0);
      
      // Undo the deletion
      deleteCommand.undo();
      
      expect(repository.findAll()).toHaveLength(1);
      expect(mockConsoleLog).toHaveBeenCalledWith(`Undoing task deletion: ${createdTask.id}`);
    });

    test('should return false when trying to delete non-existent task', () => {
      const deleteCommand = new DeleteTaskCommand('non-existent-id', repository);
      const result = deleteCommand.execute();
      
      expect(result).toBe(false);
    });
  });

  describe('UpdateTaskCommand', () => {
    test('should update an existing task', () => {
      // Create a task first
      const createCommand = new CreateTaskCommand('Original Title', 'simple', repository, observer);
      const createdTask = createCommand.execute();
      
      // Update the task
      const updateCommand = new UpdateTaskCommand(
        createdTask.id, 
        { title: 'Updated Title' }, 
        repository
      );
      const result = updateCommand.execute();
      
      expect(result).toBeDefined();
      expect(result!.title).toBe('Updated Title');
    });

    test('should support undo to restore previous state', () => {
      // Create a task
      const createCommand = new CreateTaskCommand('Original Title', 'simple', repository, observer);
      const createdTask = createCommand.execute();
      
      // Update the task
      const updateCommand = new UpdateTaskCommand(
        createdTask.id, 
        { title: 'Modified Title' }, 
        repository
      );
      updateCommand.execute();
      
      // Undo the update
      updateCommand.undo();
      
      const restoredTask = repository.findById(createdTask.id);
      expect(restoredTask!.title).toBe('Original Title');
    });

    test('should return null when trying to update non-existent task', () => {
      const updateCommand = new UpdateTaskCommand(
        'non-existent-id', 
        { title: 'New Title' }, 
        repository
      );
      const result = updateCommand.execute();
      
      expect(result).toBeNull();
    });
  });

  describe('TaskCommandInvoker', () => {
    test('should execute commands and maintain history', () => {
      const command1 = new CreateTaskCommand('Task 1', 'simple', repository, observer);
      const command2 = new CreateTaskCommand('Task 2', 'complex', repository, observer);
      
      invoker.execute(command1);
      invoker.execute(command2);
      
      expect(repository.findAll()).toHaveLength(2);
      expect(invoker.canUndo()).toBe(true);
      expect(invoker.canRedo()).toBe(false);
    });

    test('should support undo operations', () => {
      const command = new CreateTaskCommand('Undoable Task', 'simple', repository, observer);
      invoker.execute(command);
      
      expect(repository.findAll()).toHaveLength(1);
      
      const undoResult = invoker.undo();
      
      expect(undoResult).toBe(true);
      expect(repository.findAll()).toHaveLength(0);
      expect(invoker.canRedo()).toBe(true);
    });

    test('should support redo operations', () => {
      const command = new CreateTaskCommand('Redoable Task', 'simple', repository, observer);
      invoker.execute(command);
      invoker.undo();
      
      expect(repository.findAll()).toHaveLength(0);
      
      const redoResult = invoker.redo();
      
      expect(redoResult).toBe(true);
      expect(repository.findAll()).toHaveLength(1);
    });

    test('should provide command history', () => {
      const command1 = new CreateTaskCommand('Task 1', 'simple', repository, observer);
      const command2 = new UpdateTaskCommand('fake-id', { title: 'Updated' }, repository);
      
      invoker.execute(command1);
      invoker.execute(command2);
      
      const history = invoker.getHistory();
      
      expect(history).toContain('0: CreateTaskCommand');
      expect(history).toContain('1: UpdateTaskCommand <- current');
    });

    test('should clear history when requested', () => {
      const command = new CreateTaskCommand('Task', 'simple', repository, observer);
      invoker.execute(command);
      
      invoker.clearHistory();
      
      expect(invoker.getHistory()).toHaveLength(0);
      expect(invoker.canUndo()).toBe(false);
      expect(invoker.canRedo()).toBe(false);
    });
  });

  describe('MacroCommand', () => {
    test('should execute multiple commands as a group', () => {
      const command1 = new CreateTaskCommand('Macro Task 1', 'simple', repository, observer);
      const command2 = new CreateTaskCommand('Macro Task 2', 'complex', repository, observer);
      
      const macroCommand = new MacroCommand([command1, command2]);
      const results = macroCommand.execute();
      
      expect(results).toHaveLength(2);
      expect(repository.findAll()).toHaveLength(2);
    });

    test('should undo all commands in reverse order', () => {
      // Create initial task
      const initialCommand = new CreateTaskCommand('Initial Task', 'simple', repository, observer);
      const initialTask = initialCommand.execute();
      
      // Create macro with update and create commands
      const updateCommand = new UpdateTaskCommand(initialTask.id, { title: 'Updated Task' }, repository);
      const createCommand = new CreateTaskCommand('New Task', 'complex', repository, observer);
      
      const macroCommand = new MacroCommand([updateCommand, createCommand]);
      macroCommand.execute();
      
      expect(repository.findAll()).toHaveLength(2);
      
      // Undo the macro command
      macroCommand.undo();
      
      // Should have undone both commands in reverse order
      expect(repository.findAll()).toHaveLength(1);
      const remainingTask = repository.findById(initialTask.id);
      expect(remainingTask!.title).toBe('Initial Task'); // Update was undone
    });

    test('should support adding commands after creation', () => {
      const macroCommand = new MacroCommand([]);
      const command = new CreateTaskCommand('Added Task', 'simple', repository, observer);
      
      macroCommand.addCommand(command);
      
      expect(macroCommand.getCommandCount()).toBe(1);
    });
  });

  describe('CommandFactory', () => {
    test('should create create commands', () => {
      const command = CommandFactory.createCommand(
        'create',
        { title: 'Factory Task', type: 'simple' },
        repository,
        observer
      );
      
      expect(command).toBeInstanceOf(CreateTaskCommand);
      
      const result = command.execute();
      expect(result.title).toBe('Factory Task');
    });

    test('should create delete commands', () => {
      const command = CommandFactory.createCommand(
        'delete',
        { taskId: 'test-id' },
        repository
      );
      
      expect(command).toBeInstanceOf(DeleteTaskCommand);
    });

    test('should create update commands', () => {
      const command = CommandFactory.createCommand(
        'update',
        { taskId: 'test-id', updates: { title: 'New Title' } },
        repository
      );
      
      expect(command).toBeInstanceOf(UpdateTaskCommand);
    });

    test('should throw error for unknown command types', () => {
      expect(() => {
        CommandFactory.createCommand(
          'invalid' as any,
          {},
          repository
        );
      }).toThrow('Unknown command type: invalid');
    });

    test('should require observer for create commands', () => {
      expect(() => {
        CommandFactory.createCommand(
          'create',
          { title: 'Task', type: 'simple' },
          repository
          // No observer provided
        );
      }).toThrow('Observer required for create command');
    });

    test('should create batch commands', () => {
      const commands = CommandFactory.createBatchCommand([
        { type: 'create', params: { title: 'Task 1', type: 'simple' } },
        { type: 'create', params: { title: 'Task 2', type: 'complex' } }
      ], repository, observer);
      
      expect(commands).toHaveLength(2);
      expect(commands[0]).toBeInstanceOf(CreateTaskCommand);
      expect(commands[1]).toBeInstanceOf(CreateTaskCommand);
    });
  });

  describe('Integration Scenarios', () => {
    test('should handle complex workflow with undo/redo', () => {
      // Create multiple tasks
      const createCmd1 = new CreateTaskCommand('Task 1', 'simple', repository, observer);
      const createCmd2 = new CreateTaskCommand('Task 2', 'complex', repository, observer);
      
      const task1 = invoker.execute(createCmd1);
      const task2 = invoker.execute(createCmd2);
      
      // Update first task
      const updateCmd = new UpdateTaskCommand(task1.id, { title: 'Updated Task 1' }, repository);
      invoker.execute(updateCmd);
      
      expect(repository.findAll()).toHaveLength(2);
      
      // Undo update
      invoker.undo();
      let updatedTask = repository.findById(task1.id);
      expect(updatedTask!.title).toBe('Task 1');
      
      // Undo second create
      invoker.undo();
      expect(repository.findAll()).toHaveLength(1);
      
      // Redo both operations
      invoker.redo();
      expect(repository.findAll()).toHaveLength(2);
      
      invoker.redo();
      updatedTask = repository.findById(task1.id);
      expect(updatedTask!.title).toBe('Updated Task 1');
    });
  });
});
