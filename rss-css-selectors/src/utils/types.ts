export interface BaseElementOptions {
  tagName?: string;
  classes?: string[];
  textContent?: string;
  innerHTML?: string;
  parent?: HTMLElement | null;
}

export interface StateData {
  level: number;
}
