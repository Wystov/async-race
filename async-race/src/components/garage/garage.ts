import type { EventEmitter } from '../../utils/event-emitter';
import type { Car } from '../../utils/types';
import { APIHandler } from '../api-handler/api-handler';
import './car.scss';
import { carImage } from '../../data/car-image';
import { SectionCreator } from '../../utils/section-creator';
import { raceControlElements } from '../../data/page-elements.ts/garage/race-control-elements';
import { garageElements } from '../../data/page-elements.ts/garage/garage-elements';
import { carElementsData } from '../../data/page-elements.ts/garage/car-element';
import { createCarPopupData } from '../../data/page-elements.ts/garage/create-car-popup-element';

export class Garage {
  private garage: Record<string, HTMLElement> = {};
  private raceControls: Record<string, HTMLElement> = {};
  private createCarPopup: Record<string, HTMLElement> = {};
  private readonly tempCarDataStorage: Partial<Car> = {};
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
    this.raceControls = new SectionCreator(
      raceControlElements,
      parent
    ).getElements();
  }

  private createGarage(parent: HTMLElement, cars: Car[]): void {
    console.log(cars);
    this.garage = new SectionCreator(garageElements, parent).getElements();
    const { createCarBtn, title } = this.garage;
    createCarBtn.addEventListener('click', () => {
      this.showCreateCar(this.garage.controls, 'create');
    });
    title.textContent = `Garage (${cars.length})`;
    cars.forEach((car) => {
      this.createCarElement(car);
    });
  }

  private createCarElement(car: Car): void {
    const { carElements } = this.garage;
    const carElement = new SectionCreator(
      carElementsData,
      carElements
    ).getElements();
    carElement.name.textContent = car.name;
    carElement.image.innerHTML = carImage;
    carElement.image.children[0].setAttribute('fill', car.color);
    carElement.deleteBtn.dataset.id = (car.id ?? 0).toString();
    carElement.modifyBtn.dataset.id = (car.id ?? 0).toString();
    carElement.modifyBtn.dataset.color = car.color;
    carElement.modifyBtn.dataset.name = car.name;
    carElement.deleteBtn.addEventListener('click', this.deleteCar.bind(this));
    carElement.modifyBtn.addEventListener(
      'click',
      this.showModifyCar.bind(this)
    );
    this.cars.push(carElement);
  }

  private showCreateCar(parent: HTMLElement, todo: 'create' | 'modify'): void {
    if (this.garage.createCarBtn instanceof HTMLButtonElement) {
      this.garage.createCarBtn.disabled = true;
    }
    this.createCarPopup = new SectionCreator(
      createCarPopupData,
      parent
    ).getElements();
    this.createCarPopup.createBtn.addEventListener(
      'click',
      todo === 'create' ? this.addCar.bind(this) : this.modifyCar.bind(this)
    );
  }

  private addCar(): void {
    const { nameInput, colorPicker } = this.createCarPopup;
    if (
      !(nameInput instanceof HTMLInputElement) ||
      !(colorPicker instanceof HTMLInputElement)
    ) {
      throw new Error('wrong type');
    }
    APIHandler.createCar({ name: nameInput.value, color: colorPicker.value })
      .then((car) => {
        this.createCarElement(car);
        const carsCount =
          this.garage.title.textContent?.replace(/[^0-9]/g, '') ?? 0;
        this.garage.title.textContent = `Garage (${+carsCount + 1})`;
        this.createCarPopup.container.innerHTML = '';
        if (this.garage.createCarBtn instanceof HTMLButtonElement) {
          this.garage.createCarBtn.disabled = false;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  private deleteCar(e: MouseEvent): void {
    const { target } = e;
    if (!(target instanceof HTMLElement)) throw new Error('wrong target');
    const carId = target.dataset.id ?? 0;
    APIHandler.deleteCar(+carId)
      .then((ok) => {
        if (!ok) throw new Error("can't delete car");
        const carElement = target.closest('.car');
        if (carElement !== null) carElement.remove();
        const { title } = this.garage;
        const carsCount = title.textContent?.replace(/[^0-9]/g, '') ?? 0;
        title.textContent = `Garage (${+carsCount - 1})`;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  private showModifyCar(e: MouseEvent): void {
    if (!(e.target instanceof HTMLElement)) return;
    const parent = e.target.closest('.car');
    if (parent === null || !(parent instanceof HTMLElement)) return;
    this.showCreateCar(parent, 'modify');
    const { name, color, id } = e.target.dataset;
    Object.assign(this.tempCarDataStorage, { name, color, id });
    const { nameInput, colorPicker, createBtn } = this.createCarPopup;
    if (
      !(nameInput instanceof HTMLInputElement) ||
      !(colorPicker instanceof HTMLInputElement) ||
      name === undefined ||
      color === undefined
    ) {
      return;
    }
    nameInput.value = name;
    colorPicker.value = color;
    createBtn.textContent = 'update';
  }

  private modifyCar(): void {
    const { id } = this.tempCarDataStorage;
    const { nameInput, colorPicker } = this.createCarPopup;
    if (
      !(nameInput instanceof HTMLInputElement) ||
      !(colorPicker instanceof HTMLInputElement) ||
      id === undefined
    ) {
      return;
    }
    APIHandler.updateCar(id, {
      name: nameInput.value,
      color: colorPicker.value,
    })
      .then((ok) => {
        if (!ok) throw new Error("can't update car");
        const carElement = this.cars.find(
          (car) => car.modifyBtn.dataset.id === id.toString()
        );
        if (carElement === undefined) return;
        carElement.name.textContent = nameInput.value;
        carElement.image.children[0].setAttribute('fill', colorPicker.value);
        carElement.modifyBtn.dataset.color = colorPicker.value;
        carElement.modifyBtn.dataset.name = nameInput.value;
        this.createCarPopup.container.innerHTML = '';
        if (this.garage.createCarBtn instanceof HTMLButtonElement) {
          this.garage.createCarBtn.disabled = false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
