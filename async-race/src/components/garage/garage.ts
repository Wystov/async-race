import type { EventEmitter } from '../../utils/event-emitter';
import type { Car, CarsResponse } from '../../utils/types';
import { APIHandler } from '../api-handler/api-handler';
import './car.scss';
import { carImage } from '../../data/car-image';
import { SectionCreator } from '../../utils/section-creator';
import { raceControlElements } from '../../data/page-elements.ts/garage/race-control-elements';
import { garageElements } from '../../data/page-elements.ts/garage/garage-elements';
import { carElementsData } from '../../data/page-elements.ts/garage/car-element';
import { createCarPopupData } from '../../data/page-elements.ts/garage/create-car-popup-element';
import { carNames } from '../../data/car-names';

export class Garage {
  private garage: Record<string, HTMLElement> = {};
  private raceControls: Record<string, HTMLElement> = {};
  private createCarPopup: Record<string, HTMLElement> = {};
  private readonly tempCarDataStorage: Partial<Car> = {};
  private cars: Array<Record<string, HTMLElement>> = [];
  private currentPage = 1;
  private totalCars = 0;

  constructor(parent: HTMLElement, private readonly emitter: EventEmitter) {
    this.createRaceControls(parent);
    this.getCars(1, parent);
  }

  private getCars(page: number, parent?: HTMLElement): void {
    APIHandler.getCars(page)
      .then((cars) => {
        if (parent instanceof HTMLElement) {
          this.createGarage(parent, cars);
        }
        this.fillGarage(cars);
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

  private createGarage(parent: HTMLElement, response: CarsResponse): void {
    this.totalCars = response.totalCount;
    this.garage = new SectionCreator(garageElements, parent).getElements();
    const { createCarBtn, generateCarsBtn, title, controls } = this.garage;
    const { toFirstPage, toPrevPage, currentPage, toNextPage, toLastPage } =
      this.garage;
    createCarBtn.addEventListener('click', () => {
      this.showCreateCar(controls, 'create');
    });
    generateCarsBtn.addEventListener('click', this.generateCars.bind(this));
    title.textContent = `Garage (${this.totalCars})`;
    currentPage.textContent = this.currentPage.toString();
    toFirstPage.addEventListener('click', () => {
      this.currentPage = 1;
      currentPage.textContent = this.currentPage.toString();
      this.getCars(1);
    });
    toPrevPage.addEventListener('click', () => {
      if (this.currentPage === 1) return;
      this.currentPage -= 1;
      currentPage.textContent = this.currentPage.toString();
      this.getCars(this.currentPage);
    });
    toNextPage.addEventListener('click', () => {
      const lastPageNum = Math.ceil(this.totalCars / 7);
      if (this.currentPage === lastPageNum || lastPageNum === 0) return;
      this.currentPage += 1;
      currentPage.textContent = this.currentPage.toString();
      this.getCars(this.currentPage);
    });
    toLastPage.addEventListener('click', () => {
      const lastPageNum = Math.ceil(this.totalCars / 7);
      this.currentPage = lastPageNum > 0 ? lastPageNum : 1;
      currentPage.textContent = this.currentPage.toString();
      this.getCars(this.currentPage);
    });
  }

  private fillGarage(response: CarsResponse): void {
    this.cars.length = 0;
    const { cars } = response;
    this.garage.carElements.innerHTML = '';
    cars.forEach((car) => {
      this.createCarElement(car);
    });
  }

  private createCarElement(car: Car): void {
    if (this.cars.length === 7) return;
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
    const { nameInput, colorPicker } = this.createCarPopup;
    if (
      !(nameInput instanceof HTMLInputElement) ||
      !(colorPicker instanceof HTMLInputElement)
    ) {
      return;
    }
    nameInput.value = this.generateRandomName();
    colorPicker.value = this.generateRandomColor();
    // eslint-disable-next-line prettier/prettier
    const callback = todo === 'create' ? this.addCar.bind(this) : this.modifyCar.bind(this);
    this.createCarPopup.createBtn.addEventListener('click', () => {
      callback();
    });
  }

  private addCar(name?: string, color?: string): void {
    let nameValue;
    let colorValue;
    if (name !== undefined && color !== undefined) {
      nameValue = name;
      colorValue = color;
    } else {
      const { nameInput, colorPicker } = this.createCarPopup;
      if (
        !(nameInput instanceof HTMLInputElement) ||
        !(colorPicker instanceof HTMLInputElement)
      ) {
        throw new Error('wrong type');
      }
      nameValue = nameInput.value;
      colorValue = colorPicker.value;
    }

    APIHandler.createCar({ name: nameValue, color: colorValue })
      .then((car) => {
        this.createCarElement(car);
        this.totalCars += 1;
        this.garage.title.textContent = `Garage (${this.totalCars})`;
        if (this.createCarPopup.container !== undefined) {
          this.createCarPopup.container.innerHTML = '';
        }
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
        const { title } = this.garage;
        this.totalCars -= 1;
        title.textContent = `Garage (${+this.totalCars})`;
        this.cars = this.cars.filter(
          (car) => car.modifyBtn.dataset.id !== carId.toString()
        );
        if (this.cars.length === 0) {
          this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : 1;
          this.garage.currentPage.textContent = this.currentPage.toString();
        }
        this.getCars(this.currentPage);
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

  private generateCars(): void {
    const CARS_AMOUNT = 100;
    for (let i = 0; i < CARS_AMOUNT; i++) {
      const name = this.generateRandomName();
      const color = this.generateRandomColor();
      this.addCar(name, color);
    }
  }

  private generateRandomName(): string {
    const brands = Object.keys(carNames);
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const models = carNames[randomBrand];
    const randomModel = models[Math.floor(Math.random() * models.length)];
    return `${randomBrand} ${randomModel}`;
  }

  private generateRandomColor(): string {
    let color = '';
    for (let i = 0; i < 3; i++) {
      color += Math.floor(Math.random() * 256).toString(16);
    }
    return `#${color.padStart(6, '0').toUpperCase()}`;
  }
}
