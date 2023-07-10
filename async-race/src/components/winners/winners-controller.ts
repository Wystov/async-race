import { WinnersView } from './winners-view';
import './winners.scss';
import * as helpers from '../../utils/helpers';
import { APIHandler } from '../api-handler/api-handler';
import type { WinnersResponse } from '../../utils/types';
import type { State } from '../state/state';

export class WinnersController {
  private readonly view: WinnersView;

  constructor(parent: HTMLElement, private readonly state: State) {
    this.view = new WinnersView(parent);
    this.addListeners();
    this.getWinners();
  }

  private getWinners(): void {
    const { currentPage, sortBy, sortOrder } = this.state.winners;
    APIHandler.getWinners(currentPage, sortBy, sortOrder)
      .then(async (winners) => this.fillWinners(winners))
      .catch(helpers.error);
  }

  private async fillWinners(response: WinnersResponse): Promise<void> {
    this.state.winners.totalItems = response.totalCount;
    const { totalItems, currentPage } = this.state.winners;
    this.view.modifyElementsContent(totalItems, currentPage);
    this.view.clearWinnersPage();
    const { winners } = response;
    winners.forEach((winner, i) => {
      APIHandler.getCar(winner.id)
        .then((car) => {
          const number = currentPage * 10 - 9 + i;
          this.view.createWinnerElement(winner, car, number);
        })
        .catch(helpers.error);
    });
  }

  private addListeners(): void {
    const { time, wins, paginationBtns } = this.view.winners;
    time.addEventListener('click', () => this.handleSortClick('time'));
    wins.addEventListener('click', () => this.handleSortClick('wins'));
    paginationBtns.addEventListener('click', this.switchPage.bind(this));
  }

  private handleSortClick(by: 'time' | 'wins'): void {
    this.state.handleSort(by);
    this.getWinners();
  }

  private switchPage(e: MouseEvent): void {
    this.state.setCurrentPage(e, 'winners');
    const { currentPage } = this.state.winners;
    this.view.modifyElementsContent(undefined, currentPage);
    this.getWinners();
  }
}
