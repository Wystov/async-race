export interface BaseElementOptions {
  tagName?: string;
  classes?: string[];
  textContent?: string;
  parent?: HTMLElement | string | null;
  attributes?: Record<string, string> | null;
}

export interface Car {
  name: string;
  color: string;
  id?: number;
}

export type EngineStatus = 'started' | 'stopped';

export interface CarParams {
  velocity: number;
  distance: number;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export type UpdateWinner = Omit<Winner, 'id'>;
