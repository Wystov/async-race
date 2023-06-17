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
    this.createElements();
    this.addListeners();
    this.fillLevels();
  }

  private createElements(): void {
    this.elements.title = new ElementCreator({
      classes: ['selector__title'],
      textContent: 'CSS mind-breaker',
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
    }).getNode();
    this.elements.levelList = new ElementCreator({
      tagName: 'ul',
      classes: ['selector__levels'],
      parent: this.section,
    }).getNode();
    this.elements.levelList.setAttribute('style', 'max-height: 0px');
  }

  private addListeners(): void {
    this.elements.header.addEventListener(
      'click',
      this.toggleLevelList.bind(this)
    );
    this.elements.levelList.addEventListener(
      'click',
      this.onClickChangeLevel.bind(this)
    );
    this.emitter.on('change-level', this.changeLevel.bind(this));
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

  private changeLevel(data: string): void {
    this.elements.current.textContent = `${parseInt(data, 10)} level`;
  }

  private onClickChangeLevel(e: Event): void {
    if (e.target instanceof HTMLElement && e.target.textContent !== null) {
      const { levelList } = this.elements;
      if (
        levelList.getAttribute('style') ===
        `max-height: ${levelList.scrollHeight}px`
      ) {
        this.toggleLevelList();
      }
      this.emitter.emit('change-level', e.target.textContent);
    }
  }

  private toggleLevelList(): void {
    const { levelList, arrow } = this.elements;
    const isClosed = levelList.getAttribute('style') === 'max-height: 0px';
    if (isClosed) {
      levelList.setAttribute(
        'style',
        `max-height: ${levelList.scrollHeight}px`
      );
    } else {
      levelList.setAttribute('style', 'max-height: 0px');
    }
    arrow.classList.toggle('selector__arrow--active');
  }
}
