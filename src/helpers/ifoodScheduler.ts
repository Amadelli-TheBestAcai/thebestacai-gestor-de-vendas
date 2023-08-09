export class IfoodScheduler {
  static instance: IfoodScheduler | null = null;
  timeInSeconds: number;
  taskFunction: () => Promise<any>;
  timerId: NodeJS.Timeout | null = null;

  constructor(timeInSeconds: number, taskFunction: () => Promise<any>) {
    this.timeInSeconds = timeInSeconds;
    this.taskFunction = taskFunction;
  }

  static getInstance(
    timeInSeconds: number,
    taskFunction: () => Promise<any>
  ): IfoodScheduler {
    if (!IfoodScheduler.instance) {
      IfoodScheduler.instance = new IfoodScheduler(timeInSeconds, taskFunction);
    }
    return IfoodScheduler.instance;
  }

  async executeTask(): Promise<void> {
    try {
      await this.taskFunction();
    } catch (error) {
      console.error("Error executing task:", error);
    }
    this.timerId = setTimeout(
      () => this.executeTask(),
      this.timeInSeconds * 1000
    );
  }

  start(): void {
    if (this.timerId === null) {
      this.timerId = setTimeout(
        () => this.executeTask(),
        this.timeInSeconds * 1000
      );
    }
  }

  stop(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
