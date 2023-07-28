import type { Car, CarElement, ContentDefaultParams, ElementList, Engine } from '../../utils/types';
import { isButton, isHtmlElement, isInput } from '../../utils/type-guards';
import { SectionCreator } from '../../utils/section-creator';
import * as helpers from '../../utils/helpers';
import { carImage } from '../../data/car-image';
import { carElementsData } from '../../data/page-elements.ts/garage/car-element';
import { createCarPopupData } from '../../data/page-elements.ts/garage/create-car-popup-element';
import { garageElements } from '../../data/page-elements.ts/garage/garage-elements';
import { ElementCreator } from '../../utils/element-creator';

export class GarageView {
  public garage: ElementList = {};
  public cars: CarElement[] = [];
  public createCarPopup: ElementList = {};

  constructor(parent: HTMLElement) {
    this.init(parent);
  }

  private init(parent: HTMLElement): void {
    this.garage = new SectionCreator(garageElements, parent).getElements();
    this.switchRaceBtns();
  }

  public createCarElement(car: Car): CarElement {
    const { carElements } = this.garage;
    const carElement = new SectionCreator(carElementsData, carElements).getElements();
    const { name, image, controls } = carElement;
    name.textContent = car.name;
    image.innerHTML = carImage;
    image.children[0].setAttribute('fill', car.color);
    controls.dataset.id = (car.id ?? 0).toString();
    controls.dataset.color = car.color;
    controls.dataset.name = car.name;
    return carElement;
  }

  public modifyElementsContent({
    totalItems,
    currentPage,
    totalPages,
  }: ContentDefaultParams = {}): void {
    const { title, currentPageEl } = this.garage;
    if (totalItems !== undefined) {
      title.textContent = `Cars in garage: ${totalItems}`;
    }
    if (currentPage !== undefined && totalPages !== undefined) {
      currentPageEl.textContent = `${currentPage.toString()} / ${totalPages.toString()}`;
    }
  }

  public switchRaceBtns(): void {
    const { startBtn, resetBtn } = this.garage;
    helpers.disableButtons([resetBtn], true);
    helpers.disableButtons([startBtn], false);
  }

  public toggleCarBtns(car: CarElement, command: Engine): void {
    const { startEngineBtn, stopEngineBtn, modifyBtn, deleteBtn } = car;
    [startEngineBtn, stopEngineBtn, modifyBtn, deleteBtn].forEach((btn) => {
      if (!isButton(btn)) return;
      if (command === 'started') {
        btn.disabled = true;
      } else {
        btn.disabled = false;
      }
    });
  }

  public toggleStopBtn(car: CarElement): void {
    const { stopEngineBtn } = car;
    if (!isButton(stopEngineBtn)) return;
    stopEngineBtn.disabled = !stopEngineBtn.disabled;
  }

  public clearCarsPage(): void {
    this.garage.carElements.innerHTML = '';
  }

  public showCreateCar(parent: HTMLElement, callback: () => void): void {
    this.createCarPopup = new SectionCreator(createCarPopupData, parent).getElements();
    this.changeCarPopupValues('create');
    this.createCarPopup.createBtn.addEventListener('click', callback);
    const modal = this.createCarPopup.container;
    if (modal instanceof HTMLDialogElement) modal.showModal();
  }

  public showModifyCar(data: Car, callback: (id: number) => Promise<void>): void {
    if (this.createCarPopup.container !== undefined) return;
    const { id, name, color } = data;
    const carElement = this.getCarElement(id ?? 0);
    if (carElement === undefined) return;
    this.showCreateCar(carElement.container, () => {
      callback(id ?? 0).catch(helpers.error);
    });
    this.changeCarPopupValues('modify', { name, color });
  }

  private changeCarPopupValues(
    status: 'create' | 'modify',
    props?: { name: string; color: string }
  ): void {
    const { nameInput, colorPicker, createBtn } = this.createCarPopup;
    if (!isInput(nameInput) || !isInput(colorPicker)) return;
    nameInput.value = status === 'modify' ? props?.name ?? '' : helpers.generateName();
    colorPicker.value = status === 'modify' ? props?.color ?? '' : helpers.generateColor();
    createBtn.textContent = status === 'modify' ? 'update' : 'create';
  }

  public removeCarPopup(): void {
    const { container } = this.createCarPopup;
    if (container !== undefined) {
      container.remove();
      delete this.createCarPopup.container;
    }
  }

  public removeStoredCar(carId: number): void {
    this.cars = this.cars.filter((car) => car.controls.dataset.id !== carId.toString());
  }

  public extractInputValues(): { name: string; color: string } {
    const { nameInput, colorPicker } = this.createCarPopup;
    if (!isInput(nameInput) || !isInput(colorPicker)) {
      throw new TypeError('not an input element :(');
    }
    const name = nameInput.value;
    const color = colorPicker.value;
    return { name, color };
  }

  public modifyCarElement(props: Car): void {
    const { id, color, name } = props;
    const carElement = this.getCarElement(id ?? 0);
    if (carElement === undefined) return;
    carElement.name.textContent = name;
    carElement.image.children[0].setAttribute('fill', color);
    carElement.controls.dataset.color = color;
    carElement.controls.dataset.name = name;
    this.removeCarPopup();
    const { createCarBtn } = this.garage;
    if (isButton(createCarBtn)) createCarBtn.disabled = false;
  }

  public getCarElement(id: number): CarElement {
    const element = this.cars.find((car) => car.controls.dataset.id === id.toString());
    if (element === undefined) throw new Error("can't find car element");
    return element;
  }

  public moveCar(animationTime: number, carImg: HTMLElement): Animation {
    const { carElements } = this.garage;
    const padding = 10;
    const start = '0px';
    const finish = `${carElements.clientWidth - carImg.clientWidth - padding * 2}px`;
    const properties = [
      { transform: `translateX(${start}` },
      { transform: `translateX(${finish}` },
    ];
    const options: KeyframeAnimationOptions = {
      duration: animationTime,
      fill: 'forwards',
    };
    return carImg.animate(properties, options);
  }

  public showWinner(car: Car, time: number): void {
    this.garage.winnerPopup = new ElementCreator({
      classes: ['garage__winner'],
      textContent: `${car.name} wins in ${(time / 1000).toFixed(2)}seconds`,
      parent: this.garage.garage,
    }).getNode();
  }

  public hideWinner(): void {
    const { winnerPopup } = this.garage;
    if (isHtmlElement(winnerPopup)) {
      winnerPopup.remove();
      delete this.garage.winnerPopup;
    }
  }

  public disableButtonsOnRace(): void {
    const { startBtn, resetBtn, toFirstPage, createCarBtn, overlay } = this.garage;
    const { toLastPage, toNextPage, toPrevPage, generateCarsBtn } = this.garage;
    helpers.disableButtons(
      [
        startBtn,
        resetBtn,
        toFirstPage,
        toLastPage,
        toNextPage,
        toPrevPage,
        createCarBtn,
        generateCarsBtn,
      ],
      true
    );
    overlay.style.display = 'block';
  }
  public enableButtonsAfterRace(currentPage: number, totalPages: number): void {
    const { startBtn, createCarBtn, generateCarsBtn, overlay, resetBtn } = this.garage;
    overlay.style.display = 'none';
    helpers.disableButtons([startBtn, createCarBtn, generateCarsBtn], false);
    helpers.disableButtons([resetBtn], true);
    helpers.togglePaginationButtons(currentPage, totalPages, this.garage);
  }
}
