import { ElementCreator } from '../../../utils/element-creator';
import type { EventEmitter } from '../../../utils/event-emitter';
import { levelsData } from '../../../data/levels';
import './_visualizer.scss';
import { Tooltip } from './tooltip/tooltip';

export class Visualizer {
  private readonly section;
  private readonly elements: Record<string, HTMLElement> = {};
  private readonly emitter: EventEmitter;

  constructor(parent: HTMLElement, emitter: EventEmitter) {
    this.emitter = emitter;
    this.section = new ElementCreator({
      classes: ['visualizer', 'game__visualizer'],
    }).getNode();
    this.init();
    parent.append(this.section);
  }

  private init(): void {
    this.elements.title = new ElementCreator({
      classes: ['visualizer__title'],
      textContent: 'Live server',
      parent: this.section,
    }).getNode();
    this.elements.body = new ElementCreator({
      classes: ['visualizer__body'],
      parent: this.section,
    }).getNode();
    this.elements.task = new ElementCreator({
      classes: ['visualizer__task'],
      parent: this.elements.body,
    }).getNode();
    this.emitter.on('change-level', (data: string) => {
      this.changeLevel(data);
    });
    this.elements.viewContainer = new ElementCreator({
      classes: ['visualizer__view-container'],
      parent: this.elements.body,
    }).getNode();
    this.emitter.on('correct-selector', (lvl: number) => {
      this.setAnimation.bind(this)(lvl, 'element-selected');
    });
  }

  private changeLevel(data: string): void {
    const targetLvl = parseInt(data, 10) - 1;
    this.elements.task.textContent = levelsData[targetLvl].task;
    const markup = levelsData[targetLvl].html;
    if (typeof markup === 'string') {
      this.elements.viewContainer.innerHTML = markup;
    }
    this.setAnimation(targetLvl, 'select-me');
    [...this.elements.viewContainer.children].forEach((el) => {
      el.addEventListener('mouseover', this.showTooltip.bind(this));
      el.addEventListener('mouseout', this.hideTooltip.bind(this));
    });
  }

  private setAnimation(lvl: number, className: string): void {
    const targetElements = this.elements.viewContainer.querySelectorAll(
      `${levelsData[lvl].selector}`
    );
    targetElements.forEach((el) => {
      el.classList.add(className);
    });
  }

  private showTooltip(e: Event): void {
    if (!(e.target instanceof Element) || this.elements.tooltip !== undefined) {
      return;
    }
    this.elements.tooltip = new Tooltip(e.target).getElement();
  }

  private hideTooltip(e: Event): void {
    if (!(e.target instanceof Element) || this.elements.tooltip === undefined) {
      return;
    }
    e.target.classList.remove('hover');
    this.elements.tooltip.remove();
    delete this.elements.tooltip;
  }
}
