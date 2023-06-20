import type { EventEmitter } from '../../../utils/event-emitter';
import { ElementCreator } from '../../../utils/element-creator';
import { SectionCreator } from '../../../utils/section-creator';
import { selectorElements } from '../../../data/elements/task-selector';
import { levelsData } from '../../../data/levels';
import './_task-selector.scss';

export class TaskSelector extends SectionCreator {
  private readonly levels: HTMLElement[] = [];

  constructor(parent: HTMLElement, private readonly emitter: EventEmitter) {
    super(selectorElements, parent);
    this.addListeners();
    this.emitter.emit('ask-levelList-state');
  }

  private addListeners(): void {
    const { header, levelList } = this.elements;
    header.addEventListener('click', this.toggleLevelList.bind(this));
    levelList.addEventListener('click', this.handleListClick.bind(this));
    this.emitter.on('change-level', (lvl: number) => {
      this.changeCurrentLevelText(lvl);
      this.emitter.emit('ask-levelList-state');
    });
    this.emitter.on('send-levelList-state', (state: string[]) => {
      this.handleLevelList(state);
    });
  }

  private handleLevelList(state: string[]): void {
    if (this.levels.length === 0) {
      this.createLevelList(state);
      return;
    }
    this.changeLevelList(state);
  }

  private createLevelList(state: string[]): void {
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

  private changeLevelList(state: string[]): void {
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

  private changeCurrentLevelText(lvl: number): void {
    const value = lvl === levelsData.length ? 'You win' : `${lvl} level`;
    this.elements.current.textContent = value;
  }

  private handleListClick(e: Event): void {
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
      this.emitter.emit('change-level', parseInt(e.target.textContent, 10));
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
