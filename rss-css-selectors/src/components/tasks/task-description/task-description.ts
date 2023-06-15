import './_task-description.scss';
import { ElementCreator } from '../../../utils/element-creator';
import { levelsData } from '../../../data/levels';
import type { EventEmitter } from '../../../utils/event-emitter';

export class TaskDescription {
  private readonly section: HTMLElement;
  private readonly elements: Record<string, HTMLElement> = {};
  private readonly emitter: EventEmitter;

  constructor(parent: HTMLElement, emitter: EventEmitter) {
    this.emitter = emitter;
    this.section = new ElementCreator({
      classes: ['description', 'task__description'],
    }).getNode();
    this.init();
    parent.append(this.section);
  }

  private init(): void {
    this.elements.title = new ElementCreator({
      classes: ['description__title'],
      textContent: levelsData[0].title,
      parent: this.section,
    }).getNode();
    this.elements.description = new ElementCreator({
      classes: ['description__text'],
      textContent: levelsData[0].description,
      parent: this.section,
    }).getNode();
    this.emitter.on('change-level', (data: string) => {
      this.changeLevel(data);
    });
  }

  private changeLevel(elementTextContent: string): void {
    const targetLvl = parseInt(elementTextContent, 10) - 1;
    const { title, description } = this.elements;
    title.textContent = levelsData[targetLvl].title;
    description.textContent = levelsData[targetLvl].description;
  }
}
