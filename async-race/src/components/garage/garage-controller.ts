// eslint-disable-next-line prettier/prettier
import type { BtnEl, BtnMethod, Car, CarElement, CarsResponse, Engine } from '../../utils/types';
import { isButton, isHtmlElement } from '../../utils/type-guards';
import { APIHandler } from '../api-handler/api-handler';
import { GarageView } from './garage-view';
import { generateRandomName, generateRandomColor } from '../../utils/helpers';
import './car.scss';

export class GarageController {
  private currentPage = 1;
  private totalCars = 0;
  private readonly view: GarageView;

  constructor(parent: HTMLElement) {
    this.view = new GarageView(parent);
    this.addListenersToPage();
    this.getCars(this.currentPage);
  }

  private getCars(page: number): void {
    APIHandler.getCars(page)
      .then((cars) => this.fillGarage(cars))
      .catch((err) => console.error(err));
  }

  private addCar(name: string, color: string): void {
    APIHandler.createCar({ name, color })
      .then((car) => {
        this.renderCarsToPageLimit(car);
        this.totalCars += 1;
        this.view.modifyElementsContent(this.totalCars);
        this.view.removeCarPopup();
        this.view.toggleCreateCarBtn();
      })
      .catch((err) => console.log(err));
  }

  private deleteCar(id: number): void {
    APIHandler.deleteCar(id)
      .then((ok) => {
        if (!ok) throw new Error("can't delete car");
        this.totalCars -= 1;
        this.view.removeStoredCar(id);
        if (this.view.cars.length === 0) {
          this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : 1;
        }
        this.view.modifyElementsContent(this.totalCars, this.currentPage);
        this.getCars(this.currentPage);
      })
      .catch((err) => console.log(err));
  }

  private modifyCar(id: number): void {
    const { name, color } = this.view.extractInputValues();
    if (id === undefined) return;
    APIHandler.updateCar(id, { name, color })
      .then((ok) => {
        if (!ok) throw new Error("can't update car");
        this.view.modifyCarElement({ id, name, color });
      })
      .catch((err) => console.log(err));
  }

  private toggleEngine(id: number, command: Engine, car: CarElement): void {
    APIHandler.toggleEngine(id, command)
      .then(({ velocity, distance }) => {
        if (velocity > 0) {
          const animationTime = Math.round(distance / velocity);
          car.animation = this.view.moveCar(animationTime, car.image);
          this.toDriveMode(id, car.animation);
        } else {
          car.animation?.cancel();
          delete car.animation;
        }
      })
      .catch((err) => console.log(err));
  }

  private toDriveMode(id: number, animation: Animation): void {
    APIHandler.driveMode(id)
      .then((response) => {
        if (typeof response === 'string') {
          animation.pause();
          console.warn(response);
        } else {
          console.log(response);
        }
      })
      .catch((err) => console.log(err));
  }

  private addListenersToPage(): void {
    const { createCarBtn, generateCarsBtn, controls } = this.view.garage;
    const { paginationBtns } = this.view.garage;
    createCarBtn.addEventListener('click', () => {
      this.view.showCreateCar(controls, () => {
        const { name, color } = this.view.extractInputValues();
        this.addCar.bind(this)(name, color);
      });
    });
    generateCarsBtn.addEventListener('click', this.generateCars.bind(this));
    paginationBtns.addEventListener('click', this.switchPage.bind(this));
    const { startBtn, resetBtn } = this.view.raceControls;
    startBtn.addEventListener('click', () => {
      this.toggleRace('started');
    });
    resetBtn.addEventListener('click', () => {
      this.toggleRace('stopped');
    });
  }

  private switchPage(e: MouseEvent): void {
    if (!isHtmlElement(e.target)) return;
    const direction = e.target.classList[1].slice(-4).toLowerCase();
    const totalPages = Math.ceil(this.totalCars / 7);
    switch (direction) {
      case 'init':
        this.currentPage = 1;
        break;
      case 'prev':
        if (this.currentPage === 1) return;
        this.currentPage -= 1;
        break;
      case 'next':
        if (this.currentPage === totalPages || totalPages === 0) return;
        this.currentPage += 1;
        break;
      case 'last':
        this.currentPage = totalPages > 0 ? totalPages : 1;
        break;
    }
    this.view.garage.currentPage.textContent = this.currentPage.toString();
    this.getCars(this.currentPage);
  }

  private fillGarage(response: CarsResponse): void {
    this.totalCars = response.totalCount;
    this.view.modifyElementsContent(this.totalCars, this.currentPage);
    this.view.cars.length = 0;
    const { cars } = response;
    this.view.clearCarsPage();
    cars.forEach((car) => this.renderCarsToPageLimit(car));
  }

  private renderCarsToPageLimit(car: Car): void {
    if (this.view.cars.length < 7) {
      const carElement = this.view.createCarElement(car);
      this.addListenersToCar(carElement);
      this.view.cars.push(carElement);
    }
  }

  private addListenersToCar(carElement: CarElement): void {
    const { startEngineBtn, stopEngineBtn, deleteBtn, modifyBtn } = carElement;
    if (!isButton(startEngineBtn) || !isButton(stopEngineBtn)) {
      throw new TypeError('not a button element :(');
    }
    stopEngineBtn.disabled = true;
    deleteBtn.addEventListener('click', (e: MouseEvent) => {
      this.handleCarBtn(e, 'delete');
    });
    modifyBtn.addEventListener('click', (e: MouseEvent) => {
      this.handleCarBtn(e, 'modify');
    });
    startEngineBtn.addEventListener('click', (e) => {
      this.handleCarBtn(e, 'started', [startEngineBtn, stopEngineBtn]);
    });
    stopEngineBtn.addEventListener('click', (e) => {
      this.handleCarBtn(e, 'stopped', [startEngineBtn, stopEngineBtn]);
    });
  }

  private handleCarBtn(e: MouseEvent, todo: BtnMethod, buttons?: BtnEl): void {
    const data = this.extractCarData(e);
    const carElement = this.view.getCarElement(data.id ?? 0);
    switch (todo) {
      case 'delete':
        this.deleteCar(data.id ?? 0);
        break;
      case 'modify':
        this.view.showModifyCar(data, this.modifyCar.bind(this));
        break;
      case 'started':
      case 'stopped':
        if (buttons !== undefined) this.view.toggleEngineBtns(...buttons);
        this.toggleEngine(data.id ?? 0, todo, carElement);
    }
  }

  private extractCarData(e: MouseEvent): Car {
    if (!isHtmlElement(e.target)) throw new Error("can't find car element");
    const element = e.target.parentElement;
    const id = +(element?.dataset.id ?? 0);
    const name = element?.dataset.name ?? '';
    const color = element?.dataset.color ?? '';
    return { id, name, color };
  }

  private generateCars(): void {
    const CARS_AMOUNT = 100;
    for (let i = 0; i < CARS_AMOUNT; i++) {
      const name = generateRandomName();
      const color = generateRandomColor();
      this.addCar(name, color);
    }
  }

  private toggleRace(method: 'started' | 'stopped'): void {
    this.view.cars.forEach((car) => {
      const id = car.controls.dataset.id ?? 0;
      this.toggleEngine(+id, method, car);
    });
  }
}
