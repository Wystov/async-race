import { ElementCreator } from '../utils/element-creator';
import { EventEmitter } from '../utils/event-emitter';
import { Model } from './model/model';

export class App {
  private readonly emitter = new EventEmitter();

  constructor() {
    const root = new ElementCreator({ classes: ['container'] }).getNode();
    const model = new Model();
    document.body.append(root);
  }
}
