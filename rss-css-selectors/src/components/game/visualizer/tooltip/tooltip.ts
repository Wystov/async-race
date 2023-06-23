import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/scss/atom-one-dark.scss';
import { ElementCreator } from '../../../../utils/element-creator';

hljs.registerLanguage('xml', xml);

export class Tooltip {
  private readonly elements: Record<string, HTMLElement> = {};

  constructor(target: Element, parent: HTMLElement) {
    this.init(target, parent);
  }

  public getElement(): HTMLElement {
    return this.elements.tooltip;
  }

  private init(target: Element, parent: HTMLElement): void {
    const { tagName, attributes } = target;
    const attributesText = this.parseAttributes(attributes);
    const isClosingTag =
      tagName === 'DIV' || tagName === 'BORDER' || tagName === 'H1';
    let tooltipText = `<${tagName}${attributesText} />`;
    if (isClosingTag) {
      tooltipText = `<${tagName}${attributesText}> </${tagName}>`;
    }

    this.elements.tooltip = new ElementCreator({
      classes: ['visualizer__tool-tip'],
      parent,
      textContent: tooltipText.toLowerCase(),
    }).getNode();

    hljs.highlightElement(this.elements.tooltip);
    this.positionTooltip(target);
  }

  private parseAttributes(attributes: NamedNodeMap): string {
    return Array.from(attributes).reduce((acc, { name, value }) => {
      const newValue = value
        .replace('select-me', '')
        .replace('hover', '')
        .trimEnd();
      return newValue.length > 0 ? `${acc} ${name}="${newValue}"` : acc;
    }, '');
  }

  private positionTooltip(target: Element): void {
    const { left, bottom, width } = target.getBoundingClientRect();
    const halfTooltipWidth = this.elements.tooltip.offsetWidth / 2;
    const topPosition = window.scrollY + bottom + 10;
    const leftPosition = left + width / 2 - halfTooltipWidth;
    this.elements.tooltip.style.position = 'absolute';
    this.elements.tooltip.style.top = `${topPosition}px`;
    this.elements.tooltip.style.left = `${leftPosition}px`;
  }
}
