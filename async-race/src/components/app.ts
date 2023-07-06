import { ElementCreator } from '../utils/element-creator';
import { SectionCreator } from '../utils/section-creator';
import { EventEmitter } from '../utils/event-emitter';
import { Garage } from './garage/garage';
import { headerElements } from '../data/page-elements.ts/header';

export class App {
  private readonly emitter = new EventEmitter();
  private header: Record<string, HTMLElement> = {};
  private page!: Garage;

  constructor() {
    const root = new ElementCreator({ classes: ['container'] }).getNode();
    this.createHeader(root);
    this.createBody(root);
    document.body.append(root);
    console.log(this);
  }

  private createHeader(root: HTMLElement): void {
    this.header = new SectionCreator(headerElements, root).getElements();
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
