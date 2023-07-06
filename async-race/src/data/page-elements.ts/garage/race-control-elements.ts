export const raceControlElements = [
  {
    key: 'container',
    value: {
      classes: ['race-controls'],
    },
  },
  {
    key: 'title',
    value: {
      tagName: 'h2',
      classes: ['race-contorls__title'],
      textContent: 'Race controls',
      parent: 'container',
    },
  },
  {
    key: 'startBtn',
    value: {
      tagName: 'button',
      classes: ['button', 'button--start-race'],
      textContent: 'race',
      parent: 'container',
    },
  },
  {
    key: 'resetBtn',
    value: {
      tagName: 'button',
      classes: ['button', 'button--start-race'],
      textContent: 'reset',
      parent: 'container',
    },
  },
];
