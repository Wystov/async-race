import { ElementCreator } from '../../../utils/element-creator';
import { levelsData } from '../../../data/levels';

export class TaskDescription {
  private readonly section: ElementCreator;
  private readonly elements: Record<string, ElementCreator> = {};

  constructor(parent: HTMLElement) {
    this.section = new ElementCreator({
      classes: ['description', 'task__description'],
    });
    this.init();
    parent.append(this.section.getNode());
  }

  private init(): void {
    this.elements.title = new ElementCreator({
      classes: ['description__title'],
      textContent: levelsData[0].title,
      parent: this.section.getNode(),
    });
    this.elements.description = new ElementCreator({
      classes: ['description__text'],
      textContent: levelsData[0].description,
      parent: this.section.getNode(),
    });
  }
}
