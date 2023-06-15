import { ElementCreator } from '../../../utils/element-creator';

export class TaskDescription {
  private readonly taskDescription: ElementCreator;

  constructor(parent: HTMLElement) {
    this.taskDescription = new ElementCreator({
      classes: ['task__description'],
    });
    parent.append(this.taskDescription.getNode());
  }
}
