import { ElementCreator } from './element-creator';
import type { BaseElement, ElementList, ResolvePath } from './types';

export class SectionCreator {
  protected readonly elements: ElementList = {};

  constructor(elementsData: BaseElement[], parent: HTMLElement) {
    this.createElements(elementsData, parent);
  }

  private createElements(data: BaseElement[], parentSection: HTMLElement): void {
    data.forEach((element) => {
      const { value } = element;
      const node = new ElementCreator(value);
      const parent =
        typeof value.parent === 'string' ? this.resolveParent(value.parent) : parentSection;
      node.appendTo(parent);
      this.elements[element.key] = node.getNode();
    });
  }

  private resolveParent(link: string): HTMLElement {
    const parent = link
      .split('.')
      .reduce((acc: ResolvePath, key: string) => acc[key as never], this.elements);
    if (!(parent instanceof HTMLElement)) {
      throw new TypeError('Parent should be HTMLElement');
    }
    return parent;
  }

  public getElements(): Record<string, HTMLElement> {
    return this.elements;
  }
}
