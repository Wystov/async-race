export const garageElements = [
  {
    key: 'garage',
    value: {
      classes: ['garage'],
    },
  },
  {
    key: 'title',
    value: {
      tagName: 'h2',
      classes: ['garage__title'],
      parent: 'garage',
    },
  },
  {
    key: 'controls',
    value: {
      classes: ['garage__controls'],
      parent: 'garage',
    },
  },
  {
    key: 'createCarBtn',
    value: {
      tagName: 'button',
      classes: ['button--create-car'],
      textContent: 'create car',
      parent: 'controls',
    },
  },
  {
    key: 'generateCarsBtn',
    value: {
      tagName: 'button',
      classes: ['button--generate-cars'],
      textContent: 'generate cars',
      parent: 'controls',
    },
  },
  {
    key: 'carElements',
    value: {
      classes: ['garage__car-elements'],
      parent: 'garage',
    },
  },
];
