export interface BaseElement {
  key: string;
  value: BaseElementOptions;
}

export interface BaseElementOptions {
  tagName?: string;
  classes?: string[];
  textContent?: string;
  parent?: HTMLElement | string | null;
  attributes?: Record<string, string> | null;
}

export type ElementList = Record<string, HTMLElement>;

export type CarElement = {
  animation?: Animation;
} & ElementList;

export type ResolvePath = HTMLElement | ElementList;

export interface CarsResponse {
  cars: Car[];
  totalCount: number;
}

export interface Car {
  name: string;
  color: string;
  id?: number;
}

export type Engine = 'started' | 'stopped';

export interface CarParams {
  velocity: number;
  distance: number;
}

export interface WinnersResponse {
  winners: Winner[];
  totalCount: number;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export type UpdateWinner = Omit<Winner, 'id'>;

export type BtnEl = [HTMLButtonElement, HTMLButtonElement];

export type BtnMethod = 'delete' | 'modify' | 'started' | 'stopped';

export type SortBy = 'id' | 'wins' | 'time';

export type SortOrder = 'ASC' | 'DESC';

export interface GarageState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  raceMode: boolean;
}

export interface WinnersState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
}
