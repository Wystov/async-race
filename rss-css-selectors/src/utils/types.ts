export interface BaseElementOptions {
  tagName?: string;
  classes?: string[];
  textContent?: string;
  innerHTML?: string;
  parent?: HTMLElement | null;
  attributes?: Record<string, string> | null;
}

export interface StateData {
  level: number;
  levelList: string[];
}
