import { ElementCreator } from '../../../utils/element-creator';

export class TaskSelector {
  private readonly taskSelector: ElementCreator;

  constructor(parent: HTMLElement) {
    this.taskSelector = new ElementCreator({ classes: ['task__selector'] });
    parent.append(this.taskSelector.getNode());
  }
}
