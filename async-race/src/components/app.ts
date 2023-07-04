import { ElementCreator } from '../utils/element-creator';
import { EventEmitter } from '../utils/event-emitter';
import { APIHandler } from './api-handler/api-handler';

export class App {
  private readonly emitter = new EventEmitter();

  constructor() {
    const root = new ElementCreator({ classes: ['container'] }).getNode();
    const apiHandler = new APIHandler();
    document.body.append(root);
  }
}
