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
      this.setAnimation(lvl, 'element-selected');
    });
    this.emitter.on('code-hovered', (position: number) => {
      this.findElementToHover(position);
    });
    this.emitter.on('code-unhovered', this.hideTooltip.bind(this));
  }

  private changeLevel(lvl: number): void {
    const { task, viewContainer } = this.elements;
    const targetLvlIndex = lvl - 1;
    task.textContent = levelsData[targetLvlIndex].task;
    const markup = levelsData[targetLvlIndex].html;
    viewContainer.innerHTML = markup;
    this.setAnimation(targetLvlIndex, 'select-me');
    Array.from(this.elements.viewContainer.children).forEach((el) => {
      el.addEventListener('mouseover', (e) => {
        this.showTooltip(e);
        if (!(e.target instanceof Element)) return;
        const position = this.findHoveredElementPosition(e.target);
        this.emitter.emit('element-hovered', position);
      });
      el.addEventListener('mouseout', () => {
        this.emitter.emit('element-unhovered');
        this.hideTooltip();
      });
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

  private showTooltip(event: Event | Element | null): void {
    const target = event instanceof Event ? event.target : event;
    if (!(target instanceof Element) || this.elements.tooltip !== undefined) {
      return;
    }
    target.classList.add('hover');
    this.elements.hovered = target as HTMLElement;
    this.elements.tooltip = new Tooltip(target).getElement();
  }

  private hideTooltip(): void {
    this.elements.hovered.classList.remove('hover');
    delete this.elements.hovered;
    this.elements.tooltip.remove();
    delete this.elements.tooltip;
  }

  private findHoveredElementPosition(target: Element): number {
    let element: Element | null = target;
    let index = 0;
    while (element !== null && element !== this.elements.viewContainer) {
      if (element.previousElementSibling === null) {
        element = element.parentElement;
      } else {
        element = element?.previousElementSibling;
        // add +1 for closing tag in code section
        if (element.tagName === 'BORDER') index += element.children.length + 1;
      }
      index++;
    }
    return index;
  }

  private findElementToHover(position: number): void {
    let element: Element | null = this.elements.viewContainer.children[0];
    let i = 1;
    while (element !== null && i < position) {
      if (element.children.length > 0) {
        element = element.firstElementChild;
        i++;
      } else if (element.nextElementSibling !== null) {
        element = element.nextElementSibling;
        i++;
      } else {
        element = element.parentElement?.nextElementSibling ?? null;
        i++;
      }
    }
    this.showTooltip(element);
  }
}
