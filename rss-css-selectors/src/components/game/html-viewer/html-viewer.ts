import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/scss/atom-one-dark.scss';
import type { EventEmitter } from '../../../utils/event-emitter';
import { SectionCreator } from '../../../utils/section-creator';
import { viewerElements } from '../../../data/elements/html-viewer';
import { levelsData } from '../../../data/levels';
import './_html-viewer.scss';

hljs.registerLanguage('xml', xml);

export class HtmlViewer extends SectionCreator {
  constructor(parent: HTMLElement, private readonly emitter: EventEmitter) {
    super(viewerElements, parent);
    this.emitter.on('change-level', (lvl: number) => {
      this.changeLevel(lvl);
    });
  }

  private changeLevel(lvl: number): void {
    const targetLvlIndex = lvl - 1;
    const markup = this.extractMarkup(levelsData[targetLvlIndex].html);
    this.elements.code.textContent = markup;
    hljs.highlightElement(this.elements.code);
    Array.from(this.elements.code.children).forEach((el) => {
      el.addEventListener('mouseover', this.addHover.bind(this));
      el.addEventListener('mouseout', this.removeHover.bind(this));
    });
  }

  private extractMarkup(html: string): string {
    return html
      .replaceAll('></circle>', ' />')
      .replaceAll('></square>', ' />')
      .replaceAll('></triangle>', ' />')
      .replaceAll('></underscore>', ' />');
  }

  private addHover(e: Event): void {
    const target = this.getTargetElement(e.target);
    if (target === null) return;
    target.classList.add('code-hover');
    this.elements.hovered = target;
    const targetTag = target.textContent ?? '';
    if (targetTag.includes('div') || targetTag.includes('border')) {
      const isClosingTag = targetTag.startsWith('</');
      const searchDirection = isClosingTag
        ? 'previousElementSibling'
        : 'nextElementSibling';
      const pairTag = this.findPairTag(target, searchDirection);

      if (pairTag !== null) {
        pairTag.classList.add('code-hover');
        this.elements.hoveredPair = pairTag;
      }
    }
  }

  private getTargetElement(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof HTMLElement)) return null;
    const isTagElement = target.className === 'hljs-tag';
    const element = isTagElement ? target : target.parentElement;
    if (element === null || element.classList.contains('hljs')) return null;
    return element;
  }

  private findPairTag(
    origin: HTMLElement,
    searchDirection: 'previousElementSibling' | 'nextElementSibling',
    target: HTMLElement = origin
  ): HTMLElement | null {
    const sibling = target[searchDirection];
    if (!(sibling instanceof HTMLElement)) return null;
    const siblingTag = sibling.children[0]?.textContent ?? '';
    if (origin.textContent?.includes(siblingTag) ?? false) {
      return sibling;
    }
    return this.findPairTag(origin, searchDirection, sibling);
  }

  private removeHover(): void {
    this.elements.hovered.classList.remove('code-hover');
    this.elements.hoveredPair?.classList.remove('code-hover');
    delete this.elements.hovered;
    delete this.elements?.hoveredPair;
  }
}
