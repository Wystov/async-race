export const garageElements = [
  {
    key: 'garage',
    value: {
      classes: ['garage'],
    },
  },
  {
    key: 'overlay',
    value: {
      classes: ['overlay'],
      attributes: {
        title: 'Reset cars to garage first, they must be in a safe place :)',
      },
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
      classes: ['controls__button', 'controls__button--create-car'],
      textContent: '+1',
      attributes: {
        title: 'Add car',
      },
      parent: 'controls',
    },
  },
  {
    key: 'generateCarsBtn',
    value: {
      tagName: 'button',
      classes: ['controls__button', 'controls__button--generate-cars'],
      textContent: '+100',
      attributes: {
        title: 'Add 100 cars',
      },
      parent: 'controls',
    },
  },
  {
    key: 'startBtn',
    value: {
      tagName: 'button',
      classes: ['controls__button', 'controls__button--start-race'],
      textContent: 'race',
      attributes: {
        title: 'Start race',
      },
      parent: 'controls',
    },
  },
  {
    key: 'resetBtn',
    value: {
      tagName: 'button',
      classes: ['controls__button', 'controls__button--reset-race'],
      textContent: 'reset',
      attributes: {
        title: 'End race',
      },
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
