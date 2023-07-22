import { carImage } from '../../data/car-image';
import { winnersElement } from '../../data/page-elements.ts/winners/winner-elements';
import { winnersElements } from '../../data/page-elements.ts/winners/winners-elements';
import { SectionCreator } from '../../utils/section-creator';
import type { Car, ContentDefaultParams, ElementList, Winner } from '../../utils/types';

export class WinnersView {
  public winners: ElementList = {};

  constructor(parent: HTMLElement) {
    this.winners = new SectionCreator(winnersElements, parent).getElements();
  }

  public modifyElementsContent({
    totalItems,
    currentPage,
    totalPages,
  }: ContentDefaultParams = {}): void {
    const { title, currentPageEl } = this.winners;
    if (totalItems !== undefined) {
      title.textContent = `Total winners: ${totalItems}`;
    }
    if (currentPage !== undefined && totalPages !== undefined) {
      currentPageEl.textContent = `${currentPage.toString()} / ${totalPages.toString()}`;
    }
  }

  public clearWinnersPage(): void {
    this.winners.winnerElements.innerHTML = '';
  }

  public createWinnerElement(winner: Winner, car: Car, digit: number): void {
    const { winnerElements } = this.winners;
    const winnerElement = new SectionCreator(winnersElement, winnerElements).getElements();
    const { number, img, name, wins, time } = winnerElement;
    number.textContent = digit.toString();
    img.innerHTML = carImage;
    img.children[0].setAttribute('fill', car.color);
    name.textContent = car.name;
    wins.textContent = winner.wins.toString();
    time.textContent = winner.time.toString();
  }
}
