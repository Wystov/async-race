import { ElementCreator } from '../../../utils/element-creator';
import { levelsData } from '../../../data/levels';

export class TaskSelector {
  private readonly section: HTMLElement;
  private readonly elements: Record<string, HTMLElement> = {};

  constructor(parent: HTMLElement) {
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
    this.elements.levels = new ElementCreator({
      tagName: 'ul',
      classes: ['selector__levels'],
      parent: this.section,
    }).getNode();
    this.fillLevels();
  }

  private fillLevels(): void {
    levelsData.forEach((_, index) => {
      const level = new ElementCreator({
        tagName: 'li',
        textContent: `Level ${index + 1}`,
        classes: ['selector__level'],
      }).getNode();
      this.elements.levels.append(level);
    });
  }
}
