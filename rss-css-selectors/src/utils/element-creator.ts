import type { BaseElementOptions } from './types';

export class ElementCreator {
  #node: HTMLElement;

  constructor({
    tagName = 'div',
    classes = [],
    innerHTML = '',
    textContent = '',
    parent = null,
  }: Partial<BaseElementOptions>) {
    this.#node = document.createElement(tagName);
    this.#node.classList.add(...classes);
    if (innerHTML.length > 0) this.#node.innerHTML = innerHTML;
    if (textContent.length > 0) this.#node.textContent = textContent;
    if (parent instanceof HTMLElement) parent.append(this.#node);
  }

  public getNode(): HTMLElement {
    return this.#node;
  }

  public append(target: HTMLElement): void {
    this.#node.append(target);
  }
}
