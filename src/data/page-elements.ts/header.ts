export const headerElements = [
  {
    key: 'header',
    value: {
      tagName: 'header',
      classes: ['header'],
    },
  },
  {
    key: 'garageBtn',
    value: {
      tagName: 'button',
      classes: ['button', 'header__button', 'header__button--garage'],
      textContent: 'Garage',
      parent: 'header',
    },
  },
  {
    key: 'winnersBtn',
    value: {
      tagName: 'button',
      classes: ['button', 'header__button', 'header__button--winners'],
      textContent: 'Winners',
      parent: 'header',
    },
  },
];
