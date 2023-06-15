import './_tasks.scss';
import { ElementCreator } from '../../utils/element-creator';
import { TaskDescription } from './task-description/task-description';
import { TaskSelector } from './task-selector/task-selector';
import type { EventEmitter } from '../../utils/event-emitter';

export class Tasks {
  private readonly task = new ElementCreator({ classes: ['task'] });
  private readonly taskSelector;
  private readonly taskDescription;

  constructor(root: HTMLElement, emitter: EventEmitter) {
    this.taskSelector = new TaskSelector(this.task.getNode(), emitter);
    this.taskDescription = new TaskDescription(this.task.getNode(), emitter);
    root.append(this.task.getNode());
  }
}
