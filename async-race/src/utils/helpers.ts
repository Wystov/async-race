import { carNames } from '../data/car-names';

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
