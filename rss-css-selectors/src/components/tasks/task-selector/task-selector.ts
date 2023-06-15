import './_task-selector.scss';
import { ElementCreator } from '../../../utils/element-creator';
import { levelsData } from '../../../data/levels';
import type { EventEmitter } from '../../../utils/event-emitter';

export class TaskSelector {
  private readonly section: HTMLElement;
  private readonly elements: Record<string, HTMLElement> = {};
  private readonly emitter: EventEmitter;
  private readonly levels: HTMLElement[] = [];

  constructor(parent: HTMLElement, emitter: EventEmitter) {
    this.emitter = emitter;
    this.section = new ElementCreator({
      classes: ['selector', 'task__selector'],
    }).getNode();
    this.init();
    parent.append(this.section);
  }

  private init(): void {
    this.elements.title = new ElementCreator({
      classes: ['selector__title'],
      textContent: 'RSS CSS Selectors',
      parent: this.section,
    }).getNode();
    this.elements.header = new ElementCreator({
      classes: ['selector__header'],
      parent: this.section,
    }).getNode();
    this.elements.arrow = new ElementCreator({
      classes: ['selector__arrow'],
      parent: this.elements.header,
    }).getNode();
    this.elements.current = new ElementCreator({
      classes: ['selector__current'],
      parent: this.elements.header,
      textContent: 'Level 1',
    }).getNode();
    this.elements.levelList = new ElementCreator({
      tagName: 'ul',
      classes: ['selector__levels'],
      parent: this.section,
    }).getNode();
    this.elements.levelList.addEventListener(
      'click',
      this.changeLevel.bind(this)
    );
    this.fillLevels();
  }

  private fillLevels(): void {
    levelsData.forEach((_, index) => {
      const lvlElement = new ElementCreator({
        tagName: 'li',
        textContent: `${index + 1} level`,
        classes: ['selector__level'],
      }).getNode();
      this.levels.push(lvlElement);
      this.elements.levelList.append(lvlElement);
    });
  }

  private changeLevel(e: Event): void {
    if (e.target instanceof HTMLElement && e.target.textContent !== null) {
      this.elements.current.textContent = e.target.textContent;
      this.emitter.emit('change-level', e.target.textContent);
    }
  }
}
