/* eslint-disable consistent-return */
import { carNames } from '../data/car-names';
import { isButton, isHtmlElement } from './type-guards';
import type { Car } from './types';

export const generateRandomName = (): string => {
  const brands = Object.keys(carNames);
  const randomBrand = brands[Math.floor(Math.random() * brands.length)];
  const models = carNames[randomBrand];
  const randomModel = models[Math.floor(Math.random() * models.length)];
  return `${randomBrand} ${randomModel}`;
};

export const generateRandomColor = (): string => {
  let color = '';
  for (let i = 0; i < 3; i++) {
    color += Math.floor(Math.random() * 256).toString(16);
  }
  return `#${color.padStart(6, '0')}`;
};

export const extractCarData = (e: MouseEvent): Car => {
  if (!isHtmlElement(e.target)) throw new Error("can't find car element");
  const element = e.target.parentElement;
  const id = +(element?.dataset.id ?? 0);
  const name = element?.dataset.name ?? '';
  const color = element?.dataset.color ?? '';
  return { id, name, color };
};

export const error = (e: Error): void => {
  console.warn(e);
};

export const getNewPageNumber = (
  e: MouseEvent,
  totalCars: number,
  currentPage: number,
  itemsPerPage: number
): number | undefined => {
  if (!isHtmlElement(e.target)) return;
  const direction = e.target.classList[1].slice(-4).toLowerCase();
  const totalPages = Math.ceil(totalCars / itemsPerPage);
  switch (direction) {
    case 'init':
      return 1;
    case 'prev':
      if (currentPage === 1) return;
      return currentPage - 1;
    case 'next':
      if (currentPage === totalPages || totalPages === 0) return;
      return currentPage + 1;
    case 'last':
      return totalPages > 0 ? totalPages : 1;
  }
};

export const toggleButtons = (btns: HTMLElement[]): void => {
  btns.forEach((btn) => {
    if (isButton(btn)) btn.disabled = !btn.disabled;
  });
};
