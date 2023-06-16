import { ElementCreator } from '../utils/element-creator';
import { Tasks } from './tasks/tasks';
import { Game } from './game/game';
import { EventEmitter } from '../utils/event-emitter';

export class App {
  private readonly root;
  private readonly task;
  private readonly game;
  public emitter;

  constructor() {
    this.emitter = new EventEmitter();
    this.root = new ElementCreator({ classes: ['container'] }).getNode();
    this.task = new Tasks(this.root, this.emitter);
    this.game = new Game(this.root, this.emitter);

    document.body.append(this.root);
  }
}
