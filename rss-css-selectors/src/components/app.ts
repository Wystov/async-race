import { ElementCreator } from '../utils/element-creator';
import { Tasks } from './tasks/tasks';
import { Game } from './game/game';

export class App {
  private readonly root;
  private readonly task;
  private readonly game;

  constructor() {
    this.root = new ElementCreator({ classes: ['container'] }).getNode();
    this.task = new Tasks(this.root);
    this.game = new Game(this.root);

    document.body.append(this.root);
  }
}
