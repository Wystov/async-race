import type { BaseElementOptions } from './types';

export class ElementCreator {
  #node: HTMLElement;

  constructor({
    tagName = 'div',
    classes = [],
    textContent = '',
    parent = null,
    attributes = null,
  }: Partial<BaseElementOptions>) {
    this.#node = document.createElement(tagName);
    this.#node.classList.add(...classes);
    if (textContent.length > 0) this.#node.textContent = textContent;
    this.setAttributes(attributes);
    this.appendTo(parent);
  }

  private setAttributes(attributes: Record<string, string> | null): void {
    if (attributes !== null && this.#node !== undefined) {
      Object.entries(attributes).forEach(([key, value]) => {
        this.#node.setAttribute(key, value);
      });
    }
  }

  public appendTo(parent: HTMLElement | string | null): void {
    if (parent instanceof HTMLElement) parent.append(this.#node);
  }

  public getNode(): HTMLElement {
    return this.#node;
  }
}
