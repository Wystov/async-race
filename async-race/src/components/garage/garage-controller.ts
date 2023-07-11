// eslint-disable-next-line prettier/prettier
import type { BtnEl, BtnMethod, Car, CarElement, Engine, Winner } from '../../utils/types';
import { isButton } from '../../utils/type-guards';
import { APIHandler } from '../api-handler/api-handler';
import { GarageView } from './garage-view';
import * as helpers from '../../utils/helpers';
import './car.scss';
import type { State } from '../state/state';

export class GarageController {
  private readonly view: GarageView;
  private readonly racePromises: Array<Promise<Omit<Winner, 'wins'>>> = [];

  constructor(parent: HTMLElement, private readonly state: State) {
    this.view = new GarageView(parent);
    this.init();
  }

  private init(): void {
    this.addListenersToPage();
    this.fillGarage().catch(helpers.error);
  }

  private async addCar(name: string, color: string): Promise<void> {
    const car = await APIHandler.createCar({ name, color });
    this.renderCarsToPageLimit(car);
    const prevTotalPages = this.state.garage.totalPages;
    this.state.changeTotalItemsCount('add', 'garage');
    const { totalItems, currentPage, totalPages } = this.state.garage;
    this.view.modifyElementsContent({ totalItems, currentPage, totalPages });
    if (prevTotalPages !== totalPages) {
      helpers.togglePaginationButtons(currentPage, totalPages, this.view.garage);
    }
    this.view.removeCarPopup();
  }

  private async deleteCar(id: number): Promise<void> {
    await APIHandler.deleteCar(id);
    if (this.view.cars.length === 0) {
      this.state.handleEmptyPage('garage');
    }
    await this.fillGarage();
    await APIHandler.deleteWinner(id);
  }

  private async modifyCar(id: number): Promise<void> {
    const { name, color } = this.view.extractInputValues();
    await APIHandler.updateCar(id, { name, color });
    this.view.modifyCarElement({ id, name, color });
  }

  private async toggleEngine(id: number, command: Engine, car: CarElement): Promise<void> {
    try {
      const { velocity, distance } = await APIHandler.toggleEngine(id, command);
      if (velocity === 0) throw new Error('engine stopped');
      const animationTime = Math.round(distance / velocity);
      car.animation = this.view.moveCar(animationTime, car.image);
      const promise = this.toDriveMode(id, car.animation, animationTime);
      this.racePromises.push(promise);
    } catch (err) {
      car.animation?.cancel();
      delete car.animation;
    }
  }

  private async toDriveMode(
    id: number,
    animation: Animation,
    time: number
  ): Promise<Omit<Winner, 'wins'>> {
    try {
      const response = await APIHandler.driveMode(id);
      if (response !== 'success') throw new Error(response);
      return { id, time };
    } catch (err) {
      animation.pause();
      console.warn((err as Error).message);
      throw new Error('engine stopped');
    }
  }

  private async handleWinner(id: number, time: number): Promise<void> {
    const car = await APIHandler.getCar(id);
    this.view.showWinner(car, time);
    await this.setWinner(id, time);
  }

  private async setWinner(id: number, newTime: number): Promise<void> {
    try {
      const winner = await APIHandler.getWinner(id);
      if (winner === null) throw new Error('no record');
      let { time, wins } = winner;
      if (newTime < time) time = newTime;
      wins += 1;
      await APIHandler.updateWinner(id, { time, wins });
    } catch (error) {
      if ((error as Error).message === 'no record') {
        await APIHandler.createWinner({ id, wins: 1, time: newTime });
      }
    }
  }

  private addListenersToPage(): void {
    const { createCarBtn, generateCarsBtn, controls } = this.view.garage;
    const { paginationBtns } = this.view.garage;
    createCarBtn.addEventListener('click', () => {
      this.view.showCreateCar(controls, () => {
        const { name, color } = this.view.extractInputValues();
        this.addCar(name, color).catch(helpers.error);
      });
    });
    generateCarsBtn.addEventListener('click', this.generateCars.bind(this));
    paginationBtns.addEventListener('click', this.switchPage.bind(this));
    const { startBtn, resetBtn } = this.view.raceControls;
    startBtn.addEventListener('click', () => {
      helpers.disableButtons([startBtn, resetBtn], true);
      this.toggleRace('started').catch(helpers.error);
    });
    resetBtn.addEventListener('click', () => {
      this.view.hideWinner();
      this.toggleRace('stopped').catch(helpers.error);
      helpers.disableButtons([resetBtn], true);
    });
  }

  private switchPage(e: MouseEvent): void {
    this.state.setCurrentPage(e, 'garage');
    const { currentPage, totalPages } = this.state.garage;
    helpers.togglePaginationButtons(currentPage, totalPages, this.view.garage);
    this.view.hideWinner();
    this.view.modifyElementsContent({ currentPage, totalPages });
    this.fillGarage().catch(helpers.error);
  }

  private async fillGarage(): Promise<void> {
    const { currentPage } = this.state.garage;
    const { cars, totalCount } = await APIHandler.getCars(currentPage);
    this.state.garage.totalItems = totalCount;
    const { totalItems, totalPages } = this.state.garage;
    this.view.modifyElementsContent({ totalItems, currentPage, totalPages });
    this.view.cars.length = 0;
    this.view.clearCarsPage();
    cars.forEach((car) => this.renderCarsToPageLimit(car));
    helpers.togglePaginationButtons(currentPage, totalPages, this.view.garage);
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
        this.deleteCar(data.id ?? 0).catch(helpers.error);
        break;
      case 'modify':
        this.view.showModifyCar(data, this.modifyCar.bind(this));
        break;
      case 'started':
      case 'stopped':
        if (buttons !== undefined) this.view.toggleEngineBtns(...buttons);
        this.toggleEngine(data.id ?? 0, todo, carElement).catch(helpers.error);
    }
  }

  private generateCars(): void {
    const CARS_AMOUNT = 100;
    for (let i = 0; i < CARS_AMOUNT; i++) {
      const name = helpers.generateName();
      const color = helpers.generateColor();
      this.addCar(name, color).catch(helpers.error);
    }
  }

  private async toggleRace(method: 'started' | 'stopped'): Promise<void> {
    const enginePromises: Array<Promise<void>> = [];
    this.view.cars.forEach((car) => {
      const id = car.controls.dataset.id ?? 0;
      const promise = this.toggleEngine(+id, method, car);
      enginePromises.push(promise);
    });
    await Promise.all(enginePromises);
    if (method === 'stopped') {
      this.handleRaceReset();
    } else {
      this.handleRaceWinner().catch(helpers.error);
    }
  }

  private handleRaceReset(): void {
    const { startBtn } = this.view.raceControls;
    helpers.disableButtons([startBtn], false);
  }

  private async handleRaceWinner(): Promise<void> {
    const { id, time } = await Promise.any(this.racePromises);
    this.racePromises.length = 0;
    this.handleWinner(id, time).catch(helpers.error);
    const { resetBtn } = this.view.raceControls;
    helpers.disableButtons([resetBtn], false);
  }
}
