export const winnersElements = [
  {
    key: 'winners',
    value: {
      classes: ['winners'],
    },
  },
  {
    key: 'title',
    value: {
      tagName: 'h2',
      classes: ['winners__title'],
      parent: 'winners',
    },
  },
  {
    key: 'paginationBtns',
    value: {
      classes: ['winners__pagination', 'pagination'],
      parent: 'winners',
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
    key: 'container',
    value: {
      classes: ['winners__container'],
      parent: 'winners',
    },
  },
  {
    key: 'controls',
    value: {
      classes: ['winners__controls'],
      parent: 'container',
    },
  },
  {
    key: 'number',
    value: {
      tagName: 'div',
      classes: ['controls__number'],
      textContent: '№',
      parent: 'controls',
    },
  },
  {
    key: 'car',
    value: {
      tagName: 'div',
      classes: ['controls__car'],
      textContent: 'CAR',
      parent: 'controls',
    },
  },
  {
    key: 'name',
    value: {
      tagName: 'div',
      classes: ['controls__name'],
      textContent: 'NAME',
      parent: 'controls',
    },
  },
  {
    key: 'wins',
    value: {
      tagName: 'button',
      classes: ['controls__wins'],
      textContent: 'WINS',
      parent: 'controls',
    },
  },
  {
    key: 'time',
    value: {
      tagName: 'button',
      classes: ['controls__time'],
      textContent: 'TIME',
      parent: 'controls',
    },
  },
  {
    key: 'winnerElements',
    value: {
      classes: ['winners__winner-elements'],
      parent: 'container',
    },
  },
];
