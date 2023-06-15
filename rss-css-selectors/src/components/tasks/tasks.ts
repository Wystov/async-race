import './_tasks.scss';
import { ElementCreator } from '../../utils/element-creator';
import { TaskDescription } from './task-description/task-description';
import { TaskSelector } from './task-selector/task-selector';

export class Tasks {
  private readonly task = new ElementCreator({ classes: ['task'] });
  private readonly taskSelector = new TaskSelector(this.task.getNode());
  private readonly taskDescription = new TaskDescription(this.task.getNode());

  constructor(root: HTMLElement) {
    root.append(this.task.getNode());
  }
}
