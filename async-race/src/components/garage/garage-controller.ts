// eslint-disable-next-line prettier/prettier
import type { BtnEl, BtnMethod, Car, CarElement, CarsResponse, Engine } from '../../utils/types';
import { isButton } from '../../utils/type-guards';
import { APIHandler } from '../api-handler/api-handler';
import { GarageView } from './garage-view';
import * as helpers from '../../utils/helpers';
import './car.scss';
import type { State } from '../state/state';

export class GarageController {
  private readonly view: GarageView;

  constructor(parent: HTMLElement, private readonly state: State) {
    this.view = new GarageView(parent);
    this.addListenersToPage();
    this.getCars();
    const { currentPage, totalPages } = this.state.garage;
    helpers.togglePaginationButtons(currentPage, totalPages, this.view.garage);
  }

  private getCars(): void {
    const { currentPage } = this.state.garage;
    APIHandler.getCars(currentPage)
      .then((cars) => this.fillGarage(cars))
      .catch(helpers.error);
  }

  private addCar(name: string, color: string): void {
    APIHandler.createCar({ name, color })
      .then((car) => {
        this.renderCarsToPageLimit(car);
        this.state.changeTotalItemsCount('add', 'garage');
        const { totalItems } = this.state.garage;
        this.view.modifyElementsContent(totalItems);
        this.view.removeCarPopup();
        this.view.toggleCreateCarBtn();
      })
      .catch(helpers.error);
  }

  private deleteCar(id: number): void {
    APIHandler.deleteCar(id)
      .then((ok) => {
        if (!ok) throw new Error("can't delete car");
        if (this.view.cars.length === 0) {
          this.state.handleEmptyPage('garage');
        }
        const { totalItems, currentPage, totalPages } = this.state.garage;
        this.view.modifyElementsContent(totalItems, currentPage, totalPages);
        this.getCars();
      })
      .catch(helpers.error);
    APIHandler.deleteWinner(id).catch(helpers.error);
  }

  private modifyCar(id: number): void {
    const { name, color } = this.view.extractInputValues();
    if (id === undefined) return;
    APIHandler.updateCar(id, { name, color })
      .then((ok) => {
        if (!ok) throw new Error("can't update car");
        this.view.modifyCarElement({ id, name, color });
      })
      .catch(helpers.error);
  }

  private toggleEngine(id: number, command: Engine, car: CarElement): void {
    APIHandler.toggleEngine(id, command)
      .then(({ velocity, distance }) => {
        if (velocity > 0) {
          const animationTime = Math.round(distance / velocity);
          car.animation = this.view.moveCar(animationTime, car.image);
          this.toDriveMode(id, car.animation, animationTime);
        } else {
          car.animation?.cancel();
          delete car.animation;
        }
      })
      .catch(helpers.error);
  }

  private toDriveMode(id: number, animation: Animation, time: number): void {
    APIHandler.driveMode(id)
      .then((response) => {
        const { raceMode } = this.state.garage;
        if (response !== 'success') {
          animation.pause();
          console.warn(response);
        } else if (raceMode) {
          this.handleWinner(id, time);
          this.state.toggleRaceMode();
        }
      })
      .catch(helpers.error);
  }

  private handleWinner(id: number, time: number): void {
    APIHandler.getCar(id)
      .then((car: Car) => {
        this.view.showWinner(car, time);
        this.setWinner(id, time).catch(helpers.error);
      })
      .catch(helpers.error);
  }

  private async setWinner(id: number, newTime: number): Promise<void> {
    try {
      const winner = await APIHandler.getWinner(id);
      if (winner === null) throw new Error('no record');
      let { time, wins } = winner;
      if (newTime < time) time = newTime;
      wins += 1;
      void APIHandler.updateWinner(id, { time, wins });
    } catch (error) {
      if ((error as Error).message === 'no record') {
        void APIHandler.createWinner({ id, wins: 1, time: newTime });
      }
    }
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
      this.state.toggleRaceMode();
      this.toggleRace('started');
    });
    resetBtn.addEventListener('click', () => {
      this.view.hideWinner();
      this.toggleRace('stopped');
    });
  }

  private switchPage(e: MouseEvent): void {
    this.state.setCurrentPage(e, 'garage');
    const { currentPage, totalPages } = this.state.garage;
    helpers.togglePaginationButtons(currentPage, totalPages, this.view.garage);
    this.view.hideWinner();
    this.view.modifyElementsContent(undefined, currentPage, totalPages);
    this.getCars();
  }

  private fillGarage(response: CarsResponse): void {
    this.state.garage.totalItems = response.totalCount;
    const { currentPage, totalItems, totalPages } = this.state.garage;
    this.view.modifyElementsContent(totalItems, currentPage, totalPages);
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
    const data = helpers.extractCarData(e);
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

  private generateCars(): void {
    const CARS_AMOUNT = 100;
    for (let i = 0; i < CARS_AMOUNT; i++) {
      const name = helpers.generateName();
      const color = helpers.generateColor();
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
