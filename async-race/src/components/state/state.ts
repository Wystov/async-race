import { getNewPageNumber } from '../../utils/helpers';
import type { GarageState, SortBy, WinnersState } from '../../utils/types';

export class State {
  public readonly garage: GarageState = {
    currentPage: 1,
    itemsPerPage: 7,
    totalItems: 0,
    raceMode: false,
  };
  public readonly winners: WinnersState = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    sortBy: 'wins',
    sortOrder: 'DESC',
  };

  public setCurrentPage(e: MouseEvent, view: 'garage' | 'winners'): void {
    const { totalItems, currentPage, itemsPerPage } = this[view];
    const pageNum = getNewPageNumber(e, totalItems, currentPage, itemsPerPage);
    if (pageNum !== undefined) this[view].currentPage = pageNum;
  }

  public changeTotalItemsCount(
    operation: 'add' | 'delete',
    view: 'garage' | 'winners'
  ): void {
    this[view].totalItems =
      operation === 'add' ? this[view].totalItems++ : this[view].totalItems--;
  }

  public handleEmptyPage(view: 'garage' | 'winners'): void {
    const { currentPage } = this[view];
    this[view].currentPage = currentPage > 1 ? currentPage - 1 : 1;
  }

  public toggleRaceMode(): void {
    this.garage.raceMode = !this.garage.raceMode;
  }

  public handleSort(sort: SortBy): void {
    this.winners.sortBy = sort;
    this.winners.sortOrder = this.winners.sortOrder === 'DESC' ? 'ASC' : 'DESC';
  }
}
