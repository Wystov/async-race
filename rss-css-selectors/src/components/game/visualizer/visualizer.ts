import type { EventEmitter } from '../../../utils/event-emitter';
import { levelsData } from '../../../data/levels';
import './_visualizer.scss';
import { Tooltip } from './tooltip/tooltip';
import { SectionCreator } from '../../../utils/section-creator';
import { visualizerElements } from '../../../data/elements/visualizer';

export class Visualizer extends SectionCreator {
  constructor(parent: HTMLElement, private readonly emitter: EventEmitter) {
    super(visualizerElements, parent);
    this.addListeners();
  }

  private addListeners(): void {
    this.emitter.on('change-level', (lvl: number) => {
      this.changeLevel(lvl);
    });
    this.emitter.on('correct-selector', (lvl: number) => {
      this.setAnimation.bind(this)(lvl, 'element-selected');
    });
  }

  private changeLevel(lvl: number): void {
    const { task, viewContainer } = this.elements;
    const targetLvlIndex = lvl - 1;
    task.textContent = levelsData[targetLvlIndex].task;
    const markup = levelsData[targetLvlIndex].html;
    viewContainer.innerHTML = markup;
    this.setAnimation(targetLvlIndex, 'select-me');
    Array.from(this.elements.viewContainer.children).forEach((el) => {
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
    e.target.classList.add('hover');
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
