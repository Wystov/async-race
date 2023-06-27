/* eslint-disable @typescript-eslint/ban-types */
export class EventEmitter {
  public events: Record<string, Function[]> = {};

  public on<T extends Function>(event: string, callback: T): void {
    if (this.events[event] === undefined) this.events[event] = [];
    this.events[event].push(callback);
  }

  public emit<T>(event: string, ...args: T[]): void {
    if (this.events[event] === undefined) {
      console.error("Can't find event to emit");
      return;
    }
    // eslint-disable-next-line n/no-callback-literal
    this.events[event].forEach((callback) => callback(...args));
  }
}
