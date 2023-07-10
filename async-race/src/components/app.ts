import { ElementCreator } from '../utils/element-creator';
import { SectionCreator } from '../utils/section-creator';
import { GarageController } from './garage/garage-controller';
import { headerElements } from '../data/page-elements.ts/header';
import { WinnersController } from './winners/winners-controller';
import { disableButtons } from '../utils/helpers';
import { State } from './state/state';

export class App {
  private header: Record<string, HTMLElement> = {};
  private page: GarageController | WinnersController | undefined;
  private readonly state = new State();

  constructor() {
    const root = new ElementCreator({ classes: ['container'] }).getNode();
    this.init(root);
    document.body.append(root);
  }

  private init(root: HTMLElement): void {
    this.header = new SectionCreator(headerElements, root).getElements();
    const page = new ElementCreator({
      tagName: 'main',
      classes: ['body'],
      parent: root,
    }).getNode();
    const { garageBtn, winnersBtn } = this.header;
    garageBtn.addEventListener('click', () => {
      page.innerHTML = '';
      this.page = new GarageController(page, this.state);
      disableButtons([garageBtn], true);
      disableButtons([winnersBtn], false);
    });
    winnersBtn.addEventListener('click', () => {
      page.innerHTML = '';
      this.page = new WinnersController(page, this.state);
      disableButtons([garageBtn], false);
      disableButtons([winnersBtn], true);
    });
    garageBtn.click();
  }
}
