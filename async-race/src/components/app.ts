import { ElementCreator } from '../utils/element-creator';
import { EventEmitter } from '../utils/event-emitter';
import { APIHandler } from './api-handler/api-handler';
import type { Car } from '../utils/types';

export class App {
  private readonly emitter = new EventEmitter();
  private readonly apiHandler = new APIHandler();
  private readonly header: Record<string, HTMLElement> = {};
  private page: HTMLElement | null = null;
  private readonly raceControls: Record<string, HTMLElement> = {};
  private readonly garage: Record<string, HTMLElement> = {};

  constructor() {
    const root = new ElementCreator({ classes: ['container'] }).getNode();
    this.createHeader(root);
    this.createBody(root);
    this.apiHandler
      .getCars()
      .then((cars) => {
        if (!(this.page instanceof HTMLElement)) {
          throw new Error('page must be HTMLElement');
        }
        this.createGarage(this.page, cars);
      })
      .catch((e) => {
        console.log(e);
      });
    document.body.append(root);
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
    this.page = new ElementCreator({
      tagName: 'main',
      classes: ['body'],
      parent: root,
    }).getNode();
    this.createRaceControls(this.page);
  }

  private createRaceControls(parent: HTMLElement): void {
    const container = new ElementCreator({
      classes: ['race-controls'],
      parent,
    }).getNode();
    this.raceControls.title = new ElementCreator({
      tagName: 'h2',
      classes: ['race-contorls__title'],
      textContent: 'Race controls',
      parent: container,
    }).getNode();
    this.raceControls.startBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button', 'button--start-race'],
      textContent: 'race',
      parent: container,
    }).getNode();
    this.raceControls.resetBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button', 'button--start-race'],
      textContent: 'reset',
      parent: container,
    }).getNode();
  }

  private createGarage(parent: HTMLElement, cars: Car[]): void {
    console.log(cars);
    const garage = new ElementCreator({
      classes: ['garage'],
      parent,
    }).getNode();
    this.garage.title = new ElementCreator({
      tagName: 'h2',
      classes: ['garage__title'],
      textContent: `Garage (${cars.length})`,
      parent: garage,
    }).getNode();
    const controls = new ElementCreator({
      classes: ['garage__controls'],
      parent: garage,
    }).getNode();
    this.garage.createCarBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button--create-car'],
      textContent: 'create car',
      parent: controls,
    }).getNode();
    this.garage.generateCarsBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button--generate-cars'],
      textContent: 'generate cars',
      parent: controls,
    }).getNode();
    cars.forEach((car) => {
      this.createCar(garage, car);
    });
  }

  private createCar(parent: HTMLElement, car: Car): void {
    const carContainer = new ElementCreator({
      classes: ['garage__car', 'car'],
      parent,
    }).getNode();
    const carName = new ElementCreator({
      tagName: 'span',
      classes: ['car__name'],
      textContent: car.name,
      parent: carContainer,
    });
    const carControls = new ElementCreator({
      classes: ['car__conrtols'],
      parent: carContainer,
    }).getNode();
    const carModifyBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button--modify-car'],
      textContent: 'modify',
      parent: carControls,
    });
    const carDeleteBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button--delete-car'],
      textContent: 'delete',
      parent: carControls,
    });
    const carStartEngineBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button--start-engine'],
      textContent: 'start',
      parent: carControls,
    });
    const carStopEngineBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button--stop-engine'],
      textContent: 'stop',
      parent: carControls,
    });
  }
}
