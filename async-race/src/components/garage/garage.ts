import { ElementCreator } from '../../utils/element-creator';
import { type EventEmitter } from '../../utils/event-emitter';
import type { Car } from '../../utils/types';
import { APIHandler } from '../api-handler/api-handler';
import './car.scss';
import { carImage } from '../../data/car-image';

export class Garage {
  private readonly raceControls: Record<string, HTMLElement> = {};
  private readonly garage: Record<string, HTMLElement> = {};
  private readonly cars: Array<Record<string, HTMLElement>> = [];

  constructor(parent: HTMLElement, private readonly emitter: EventEmitter) {
    this.createRaceControls(parent);
    APIHandler.getCars()
      .then((cars) => {
        this.createGarage(parent, cars);
      })
      .catch((e) => {
        console.error(e);
      });
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
    this.garage.createCarBtn.addEventListener('click', () => {
      this.showCreateCar(controls);
    });
    this.garage.generateCarsBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button--generate-cars'],
      textContent: 'generate cars',
      parent: controls,
    }).getNode();
    this.garage.carElements = new ElementCreator({
      classes: ['garage__car-elements'],
      parent: garage,
    }).getNode();
    cars.forEach((car) => {
      this.createCar(car);
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private createCar(car: Car): void {
    console.log(car);
    const { carElements } = this.garage;
    const carElement: Record<string, HTMLElement> = {};
    carElement.container = new ElementCreator({
      classes: ['garage__car', 'car'],
      parent: carElements,
    }).getNode();
    carElement.name = new ElementCreator({
      tagName: 'span',
      classes: ['car__name'],
      textContent: car.name,
      parent: carElement.container,
    }).getNode();
    carElement.controls = new ElementCreator({
      classes: ['car__controls'],
      parent: carElement.container,
    }).getNode();
    carElement.modifyBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button--modify-car'],
      textContent: 'modify',
      parent: carElement.controls,
    }).getNode();
    carElement.deleteBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button--delete-car'],
      textContent: 'delete',
      parent: carElement.controls,
    }).getNode();
    carElement.startEngineBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button--start-engine'],
      textContent: 'start',
      parent: carElement.controls,
    }).getNode();
    carElement.stopEngineBtn = new ElementCreator({
      tagName: 'button',
      classes: ['button--stop-engine'],
      textContent: 'stop',
      parent: carElement.controls,
    }).getNode();
    carElement.image = new ElementCreator({
      classes: ['car__image'],
      parent: carElement.container,
    }).getNode();
    carElement.image.innerHTML = carImage;
    carElement.image.children[0].setAttribute('fill', car.color);
    this.cars.push(carElement);
  }

  // eslint-disable-next-line max-lines-per-function
  private showCreateCar(parent: HTMLElement): void {
    const container = new ElementCreator({
      classes: ['car-creation__container'],
      parent,
    }).getNode();
    const nameInput = new ElementCreator({
      tagName: 'input',
      classes: ['car-creation__name-input'],
      attributes: {
        type: 'text',
      },
      parent: container,
    }).getNode();
    const colorPicker = new ElementCreator({
      tagName: 'input',
      classes: ['car-creation__color-picker'],
      attributes: {
        type: 'color',
      },
      parent: container,
    }).getNode();
    const createButton = new ElementCreator({
      tagName: 'button',
      classes: ['car-creation__submit-btn'],
      textContent: 'create',
      parent: container,
    }).getNode();
    createButton.addEventListener('click', () => {
      if (
        !(nameInput instanceof HTMLInputElement) ||
        !(colorPicker instanceof HTMLInputElement)
      ) {
        throw new Error('wrong type');
      }
      console.log(nameInput.value);
      APIHandler.createCar({
        name: nameInput.value,
        color: colorPicker.value,
      })
        .then((car) => {
          this.createCar(car);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }
}
