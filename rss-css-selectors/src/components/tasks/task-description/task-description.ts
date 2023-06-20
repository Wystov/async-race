import type { EventEmitter } from '../../../utils/event-emitter';
import { SectionCreator } from '../../../utils/section-creator';
import { levelsData } from '../../../data/levels';
import { descriptionElements } from '../../../data/elements/task-description';
import './_task-description.scss';

export class TaskDescription extends SectionCreator {
  constructor(parent: HTMLElement, private readonly emitter: EventEmitter) {
    super(descriptionElements, parent);
    this.emitter.on('change-level', (lvl: number) => {
      this.changeLevel(lvl);
    });
  }

  private changeLevel(lvl: number): void {
    const targetLvlIndex = lvl - 1;
    const { title, description } = this.elements;
    title.textContent = levelsData[targetLvlIndex].title;
    description.textContent = levelsData[targetLvlIndex].description;
  }
}
