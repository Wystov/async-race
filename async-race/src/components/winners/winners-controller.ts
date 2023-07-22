import { WinnersView } from './winners-view';
import './winners.scss';
import * as helpers from '../../utils/helpers';
import { APIHandler } from '../api-handler/api-handler';
import type { State } from '../state/state';

export class WinnersController {
  private readonly view: WinnersView;

  constructor(parent: HTMLElement, private readonly state: State) {
    this.view = new WinnersView(parent);
    helpers.togglePaginationButtons(1, 1, this.view.winners);
    this.init().catch(helpers.error);
  }

  private async init(): Promise<void> {
    this.addListeners();
    await this.fillWinners();
    const { currentPage, totalPages } = this.state.winners;
    helpers.togglePaginationButtons(currentPage, totalPages, this.view.winners);
  }

  private async fillWinners(): Promise<void> {
    const { currentPage, sortBy, sortOrder } = this.state.winners;
    const { winners, totalCount } = await APIHandler.getWinners(currentPage, sortBy, sortOrder);
    this.state.winners.totalItems = totalCount;
    const { totalItems, totalPages } = this.state.winners;
    this.view.modifyElementsContent({ totalItems, currentPage, totalPages });
    this.view.clearWinnersPage();
    const winnerPromises = winners.map(async (winner, i) => {
      const car = await APIHandler.getCar(winner.id);
      const number = currentPage * 10 - 9 + i;
      this.view.createWinnerElement(winner, car, number);
    });
    await Promise.allSettled(winnerPromises);
  }

  private addListeners(): void {
    const { time, wins, paginationBtns } = this.view.winners;
    time.addEventListener('click', () => this.handleSortClick('time'));
    wins.addEventListener('click', () => this.handleSortClick('wins'));
    paginationBtns.addEventListener('click', this.switchPage.bind(this));
  }

  private handleSortClick(by: 'time' | 'wins'): void {
    this.state.handleSort(by);
    this.fillWinners().catch(helpers.error);
  }

  private switchPage(e: MouseEvent): void {
    if (!(e.target instanceof HTMLButtonElement)) return;
    this.state.setCurrentPage(e, 'winners');
    const { currentPage, totalPages } = this.state.winners;
    helpers.togglePaginationButtons(currentPage, totalPages, this.view.winners);
    this.view.modifyElementsContent({ currentPage, totalPages });
    this.fillWinners().catch(helpers.error);
  }
}
