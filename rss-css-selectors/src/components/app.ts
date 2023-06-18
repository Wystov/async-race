import { ElementCreator } from '../utils/element-creator';
import { Tasks } from './tasks/tasks';
import { Game } from './game/game';
import { EventEmitter } from '../utils/event-emitter';
import { State } from './state/state';

export class App {
  private readonly root;
  private readonly task;
  private readonly game;
  private readonly state;
  public emitter;

  constructor() {
    this.emitter = new EventEmitter();
    this.state = new State(this.emitter);
    this.root = new ElementCreator({ classes: ['container'] }).getNode();
    this.task = new Tasks(this.root, this.emitter);
    this.game = new Game(this.root, this.emitter);

    document.body.append(this.root);
  }
}
