import { ElementCreator } from '../../utils/element-creator';
import { TaskDescription } from './task-description/task-description';
import { TaskSelector } from './task-selector/task-selector';

export class Tasks {
  private readonly task: ElementCreator;
  private readonly taskSelector: TaskSelector;
  private readonly taskDescription: TaskDescription;

  constructor(root: HTMLElement) {
    this.task = new ElementCreator({ classes: ['task'] });
    this.taskSelector = new TaskSelector(this.task.getNode());
    this.taskDescription = new TaskDescription(this.task.getNode());

    root.append(this.task.getNode());
  }
}
