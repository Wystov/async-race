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
    key: 'paginationBtns',
    value: {
      classes: ['garage__pagination', 'pagination'],
      parent: 'garage',
    },
  },
  {
    key: 'toFirstPage',
    value: {
      tagName: 'button',
      classes: ['button', 'pagination__toInit'],
      textContent: '<<',
      parent: 'paginationBtns',
    },
  },
  {
    key: 'toPrevPage',
    value: {
      tagName: 'button',
      classes: ['button', 'pagination__toPrev'],
      textContent: '<',
      parent: 'paginationBtns',
    },
  },
  {
    key: 'currentPageEl',
    value: {
      classes: ['button', 'pagination__current'],
      parent: 'paginationBtns',
    },
  },
  {
    key: 'toNextPage',
    value: {
      tagName: 'button',
      classes: ['button', 'pagination__toNext'],
      textContent: '>',
      parent: 'paginationBtns',
    },
  },
  {
    key: 'toLastPage',
    value: {
      tagName: 'button',
      classes: ['button', 'pagination__toLast'],
      textContent: '>>',
      parent: 'paginationBtns',
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
