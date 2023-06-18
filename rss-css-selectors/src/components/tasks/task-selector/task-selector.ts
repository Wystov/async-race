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
    this.emitter.emit('ask-levelList-state');
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
    this.emitter.on('change-level', (data: string) => {
      this.changeLevel(data);
      this.emitter.emit('ask-levelList-state');
    });
    this.emitter.on('send-levelList-state', (state: string[]) => {
      this.fillLevels(state);
    });
  }

  private fillLevels(state: string[]): void {
    if (this.levels.length > 0) {
      this.changeLevelsState(state);
      return;
    }
    levelsData.forEach((data, index) => {
      if (data.title === 'Final message') return;
      const lvlElement = new ElementCreator({
        tagName: 'li',
        textContent: `${index + 1} level`,
        classes: ['selector__level', `selector__level--${state[index]}`],
      }).getNode();
      this.levels.push(lvlElement);
      this.elements.levelList.append(lvlElement);
    });
    this.elements.resetBtn = new ElementCreator({
      tagName: 'button',
      classes: ['selector__reset-btn'],
      textContent: 'Reset progress',
      parent: this.elements.levelList,
    }).getNode();
  }

  private changeLevelsState(state: string[]): void {
    if (this.elements.current.textContent === null) return;
    const currentLvlIndex = parseInt(this.elements.current.textContent, 10) - 1;
    this.levels.forEach((el, index) => {
      el.removeAttribute('class');
      el.classList.add('selector__level', `selector__level--${state[index]}`);
      if (index === currentLvlIndex) {
        el.classList.add('selector__level--active');
      }
    });
  }

  private changeLevel(data: string): void {
    const newLvl = parseInt(data, 10);
    const value = newLvl === levelsData.length ? 'You win' : `${newLvl} level`;
    this.elements.current.textContent = value;
  }

  private onClickChangeLevel(e: Event): void {
    if (e.target instanceof HTMLElement && e.target.textContent !== null) {
      if (e.target.classList.contains('selector__reset-btn')) {
        this.emitter.emit('reset-progress');
        return;
      }
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
