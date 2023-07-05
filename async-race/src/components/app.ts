import { ElementCreator } from '../utils/element-creator';
import { EventEmitter } from '../utils/event-emitter';
import { Garage } from './garage/garage';

export class App {
  private readonly emitter = new EventEmitter();
  private readonly header: Record<string, HTMLElement> = {};
  private page!: Garage;

  constructor() {
    const root = new ElementCreator({ classes: ['container'] }).getNode();
    this.createHeader(root);
    this.createBody(root);
    document.body.append(root);
    console.log(this);
  }

  private createHeader(root: HTMLElement): void {
    const header = new ElementCreator({
      tagName: 'header',
      classes: ['header'],
      parent: root,
    }).getNode();
    this.header.garageBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button', 'header__button', 'header__button--garage'],
      textContent: 'garage',
      parent: header,
    }).getNode();
    this.header.winnersBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button', 'header__button', 'header__button--winners'],
      textContent: 'winners',
      parent: header,
    }).getNode();
  }

  private createBody(root: HTMLElement): void {
    const page = new ElementCreator({
      tagName: 'main',
      classes: ['body'],
      parent: root,
    }).getNode();
    this.page = new Garage(page, this.emitter);
  }
}
