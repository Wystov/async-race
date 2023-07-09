import { WinnersView } from './winners-view';
import './winners.scss';
import * as helpers from '../../utils/helpers';
import { APIHandler } from '../api-handler/api-handler';
import type { SortBy, SortOrder, WinnersResponse } from '../../utils/types';

export class WinnersController {
  private currentPage = 1;
  private readonly itemsPerPage = 10;
  private totalWinners = 0;
  private sortBy: SortBy = 'wins';
  private sortOrder: SortOrder = 'DESC';
  private readonly view: WinnersView;

  constructor(parent: HTMLElement) {
    this.view = new WinnersView(parent);
    this.addListeners();
    this.getWinners(this.currentPage, this.sortBy, this.sortOrder);
  }

  private getWinners(
    page: number = this.currentPage,
    sortBy: SortBy = this.sortBy,
    order: SortOrder = this.sortOrder
  ): void {
    APIHandler.getWinners(page, sortBy, order)
      .then(async (winners) => this.fillWinners(winners))
      .catch(helpers.error);
  }

  private async fillWinners(response: WinnersResponse): Promise<void> {
    this.totalWinners = response.totalCount;
    this.view.modifyElementsContent(this.totalWinners, this.currentPage);
    this.view.clearWinnersPage();
    const { winners } = response;
    winners.forEach((winner, i) => {
      APIHandler.getCar(winner.id)
        .then((car) => {
          const number = this.currentPage * 10 - 9 + i;
          this.view.createWinnerElement(winner, car, number);
        })
        .catch(helpers.error);
    });
  }

  private addListeners(): void {
    const { time, wins, paginationBtns } = this.view.winners;
    time.addEventListener('click', () => {
      this.sortBy = 'time';
      this.sortOrder = this.sortOrder === 'DESC' ? 'ASC' : 'DESC';
      this.getWinners(this.currentPage, this.sortBy, this.sortOrder);
    });
    wins.addEventListener('click', () => {
      this.sortBy = 'wins';
      this.sortOrder = this.sortOrder === 'DESC' ? 'ASC' : 'DESC';
      this.getWinners(this.currentPage, this.sortBy, this.sortOrder);
    });
    paginationBtns.addEventListener('click', this.switchPage.bind(this));
  }

  private switchPage(e: MouseEvent): void {
    const { currentPage, totalWinners } = this;
    this.currentPage =
      helpers.getNewPageNumber(
        e,
        totalWinners,
        currentPage,
        this.itemsPerPage
      ) ?? currentPage;
    this.view.modifyElementsContent(undefined, this.currentPage);
    this.getWinners();
  }
}
