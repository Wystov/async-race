/* eslint-disable @typescript-eslint/ban-types */
export class EventEmitter {
  public events: Record<string, Function[]> = {};

  public on(event: string, callback: Function): void {
    if (this.events[event] === undefined) this.events[event] = [];
    this.events[event].push(callback);
  }

  public emit(event: string, ...args: unknown[]): void {
    if (this.events[event] === undefined) {
      console.error("Can't find event to emit");
      return;
    }
    // eslint-disable-next-line n/no-callback-literal
    this.events[event].forEach((callback) => callback(...args));
  }

  public off(event: string, callback: Function): void {
    if (this.events[event] === undefined) {
      console.error("Can't find event to disable");
      return;
    }
    this.events[event] = this.events[event].filter((func) => func !== callback);
  }
}
