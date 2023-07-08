import { ElementCreator } from '../utils/element-creator';
import { SectionCreator } from '../utils/section-creator';
import { GarageController } from './garage/garage-controller';
import { headerElements } from '../data/page-elements.ts/header';

export class App {
  private header: Record<string, HTMLElement> = {};
  private page!: GarageController;

  constructor() {
    const root = new ElementCreator({ classes: ['container'] }).getNode();
    this.init(root);
    document.body.append(root);
    console.log(this);
  }

  private init(root: HTMLElement): void {
    this.header = new SectionCreator(headerElements, root).getElements();
    const page = new ElementCreator({
      tagName: 'main',
      classes: ['body'],
      parent: root,
    }).getNode();
    this.page = new GarageController(page);
  }
}
