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
    const markup = levelsData[targetLvlIndex].html;
    if (typeof markup === 'string') {
      this.elements.code.textContent = markup;
      hljs.highlightElement(this.elements.code);
    }
  }
}
