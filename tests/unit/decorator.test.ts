// Decorator Pattern Tests - Design Pattern Implementation Validation
// Tests the Decorator pattern functionality with multiple decorators

import { 
  BaseTask, 
  PriorityDecorator, 
  DeadlineDecorator, 
  NotificationDecorator, 
  LoggingDecorator,
  DecoratedTaskFactory,
  DecoratedTask
} from '../../src/decorator';

// Mock console.log to capture output for testing
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

describe('Decorator Pattern', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  describe('BaseTask', () => {
    test('should create a basic task with default properties', () => {
      const task = new BaseTask('Test Task');
      
      expect(task.getTitle()).toBe('Test Task');
      expect(task.getDescription()).toBe('Basic task');
      expect(task.getPriority()).toBe('normal');
      expect(task.getDeadline()).toBeNull();
    });

    test('should execute basic task', () => {
      const task = new BaseTask('Execute Test');
      task.execute();
      
      expect(mockConsoleLog).toHaveBeenCalledWith('Executing task: Execute Test');
    });
  });

  describe('PriorityDecorator', () => {
    test('should add priority to task title', () => {
      const baseTask = new BaseTask('Important Task');
      const priorityTask = new PriorityDecorator(baseTask, 'urgent');
      
      expect(priorityTask.getTitle()).toBe('🚨 Important Task');
      expect(priorityTask.getPriority()).toBe('urgent');
    });

    test('should add different priority emojis', () => {
      const baseTask = new BaseTask('Task');
      
      const urgentTask = new PriorityDecorator(baseTask, 'urgent');
      const highTask = new PriorityDecorator(baseTask, 'high');
      const lowTask = new PriorityDecorator(baseTask, 'low');
      const normalTask = new PriorityDecorator(baseTask, 'normal');
      
      expect(urgentTask.getTitle()).toBe('🚨 Task');
      expect(highTask.getTitle()).toBe('⚡ Task');
      expect(lowTask.getTitle()).toBe('📌 Task');
      expect(normalTask.getTitle()).toBe(' Task');
    });

    test('should show urgent warning on execution', () => {
      const baseTask = new BaseTask('Urgent Task');
      const urgentTask = new PriorityDecorator(baseTask, 'urgent');
      
      urgentTask.execute();
      
      expect(mockConsoleLog).toHaveBeenCalledWith('⚠️ URGENT TASK EXECUTION!');
      expect(mockConsoleLog).toHaveBeenCalledWith('Executing task: Urgent Task');
    });
  });

  describe('DeadlineDecorator', () => {
    test('should add deadline information to description', () => {
      const baseTask = new BaseTask('Deadline Task');
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 3); // 3 days from now
      
      const deadlineTask = new DeadlineDecorator(baseTask, deadline);
      
      expect(deadlineTask.getDeadline()).toBe(deadline);
      expect(deadlineTask.getDescription()).toContain('Due in 3 days');
      expect(deadlineTask.getDescription()).toContain(deadline.toDateString());
    });

    test('should warn about overdue tasks', () => {
      const baseTask = new BaseTask('Overdue Task');
      const pastDeadline = new Date();
      pastDeadline.setDate(pastDeadline.getDate() - 1); // Yesterday
      
      const overdueTask = new DeadlineDecorator(baseTask, pastDeadline);
      overdueTask.execute();
      
      expect(mockConsoleLog).toHaveBeenCalledWith('⏰ WARNING: This task is overdue!');
    });

    test('should warn about tasks due today', () => {
      const baseTask = new BaseTask('Due Today Task');
      const todayDeadline = new Date();
      todayDeadline.setHours(todayDeadline.getHours() + 2); // 2 hours from now
      
      const dueTodayTask = new DeadlineDecorator(baseTask, todayDeadline);
      dueTodayTask.execute();
      
      expect(mockConsoleLog).toHaveBeenCalledWith('⏰ WARNING: This task is due today!');
    });
  });

  describe('NotificationDecorator', () => {
    test('should add notification functionality', () => {
      const baseTask = new BaseTask('Notification Task');
      const notificationTask = new NotificationDecorator(baseTask);
      
      expect(notificationTask.getDescription()).toContain('With notifications enabled');
    });

    test('should send notifications on execution', () => {
      const baseTask = new BaseTask('Notify Task');
      const notificationTask = new NotificationDecorator(baseTask);
      
      notificationTask.execute();
      
      expect(mockConsoleLog).toHaveBeenCalledWith('📧 Sending notification for task: Notify Task');
      expect(mockConsoleLog).toHaveBeenCalledWith('Executing task: Notify Task');
      expect(mockConsoleLog).toHaveBeenCalledWith('✅ Task completed and stakeholders notified');
    });
  });

  describe('LoggingDecorator', () => {
    test('should log detailed execution information', () => {
      const baseTask = new BaseTask('Logged Task');
      const loggedTask = new LoggingDecorator(baseTask);
      
      loggedTask.execute();
      
      expect(mockConsoleLog).toHaveBeenCalledWith('[LOG] Starting execution of task: Logged Task');
      expect(mockConsoleLog).toHaveBeenCalledWith('[LOG] Priority: normal');
      expect(mockConsoleLog).toHaveBeenCalledWith('[LOG] Description: Basic task');
      expect(mockConsoleLog).toHaveBeenCalledWith('Executing task: Logged Task');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringMatching(/\[LOG\] Task completed in \d+ms/));
    });
  });

  describe('Multiple Decorators', () => {
    test('should chain decorators correctly', () => {
      const baseTask = new BaseTask('Multi-Decorated Task');
      let decoratedTask: DecoratedTask = new PriorityDecorator(baseTask, 'high');
      decoratedTask = new NotificationDecorator(decoratedTask);
      decoratedTask = new LoggingDecorator(decoratedTask);
      
      expect(decoratedTask.getTitle()).toBe('⚡ Multi-Decorated Task');
      expect(decoratedTask.getPriority()).toBe('high');
      expect(decoratedTask.getDescription()).toContain('With notifications enabled');
    });

    test('should execute all decorators in correct order', () => {
      const baseTask = new BaseTask('Chained Task');
      let decoratedTask: DecoratedTask = new PriorityDecorator(baseTask, 'urgent');
      decoratedTask = new NotificationDecorator(decoratedTask);
      decoratedTask = new LoggingDecorator(decoratedTask);
      
      decoratedTask.execute();
      
      // Verify execution order: Logging → Notification → Priority → Base
      const logCalls = mockConsoleLog.mock.calls.map(call => call[0]);
      expect(logCalls[0]).toContain('[LOG] Starting execution');
      expect(logCalls).toContain('📧 Sending notification for task: 🚨 Chained Task');
      expect(logCalls).toContain('⚠️ URGENT TASK EXECUTION!');
      expect(logCalls).toContain('Executing task: Chained Task');
      expect(logCalls).toContain('✅ Task completed and stakeholders notified');
      expect(logCalls[logCalls.length - 1]).toContain('[LOG] Task completed in');
    });
  });

  describe('DecoratedTaskFactory', () => {
    test('should create task with multiple decorators via factory', () => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 2);
      
      const complexTask = DecoratedTaskFactory.createTask('Factory Task', {
        priority: 'urgent',
        deadline: deadline,
        notifications: true,
        logging: true
      });
      
      expect(complexTask.getTitle()).toBe('🚨 Factory Task');
      expect(complexTask.getPriority()).toBe('urgent');
      expect(complexTask.getDeadline()).toBe(deadline);
      expect(complexTask.getDescription()).toContain('Due in 2 days');
      expect(complexTask.getDescription()).toContain('With notifications enabled');
    });

    test('should create simple task when no decorators specified', () => {
      const simpleTask = DecoratedTaskFactory.createTask('Simple Factory Task');
      
      expect(simpleTask.getTitle()).toBe('Simple Factory Task');
      expect(simpleTask.getPriority()).toBe('normal');
      expect(simpleTask.getDeadline()).toBeNull();
      expect(simpleTask.getDescription()).toBe('Basic task');
    });

    test('should apply decorators in correct order', () => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 1);
      
      const task = DecoratedTaskFactory.createTask('Ordered Task', {
        priority: 'high',
        deadline: deadline,
        notifications: true,
        logging: true
      });
      
      task.execute();
      
      // Verify that all decorators were applied and execute in correct order
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('[LOG] Starting execution of task: ⚡ Ordered Task'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('📧 Sending notification'));
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('⏰ WARNING: This task is due today!'));
    });
  });
});
