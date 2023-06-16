import { ElementCreator } from '../../../utils/element-creator';
import type { EventEmitter } from '../../../utils/event-emitter';
import { levelsData } from '../../../data/levels';

export class HtmlViewer {
  private readonly section;
  private readonly elements: Record<string, HTMLElement> = {};
  private readonly emitter: EventEmitter;

  constructor(parent: HTMLElement, emitter: EventEmitter) {
    this.emitter = emitter;
    this.section = new ElementCreator({
      classes: ['html-viewer', 'game__html-viewer'],
    }).getNode();
    this.init();
    parent.append(this.section);
  }

  private init(): void {
    this.elements.title = new ElementCreator({
      classes: ['html-viewer__title'],
      textContent: 'index.html',
      parent: this.section,
    }).getNode();
    this.elements.body = new ElementCreator({
      classes: ['html-viewer__body'],
      parent: this.section,
    }).getNode();
    this.emitter.on('change-level', (data: string) => {
      this.changeLevel(data);
    });
  }

  private changeLevel(data: string): void {
    const targetLvl = parseInt(data, 10) - 1;
    const markup = levelsData[targetLvl].html;
    if (typeof markup === 'string') {
      this.elements.body.textContent = markup;
    }
  }
}
