export const carElementsData = [
  {
    key: 'container',
    value: {
      classes: ['garage__car', 'car'],
    },
  },
  {
    key: 'name',
    value: {
      tagName: 'span',
      classes: ['car__name'],
      parent: 'container',
    },
  },
  {
    key: 'controls',
    value: {
      classes: ['car__controls'],
      parent: 'container',
    },
  },
  {
    key: 'modifyBtn',
    value: {
      tagName: 'button',
      classes: ['button--modify-car'],
      textContent: 'modify',
      parent: 'controls',
    },
  },
  {
    key: 'deleteBtn',
    value: {
      tagName: 'button',
      classes: ['button--delete-car'],
      textContent: 'delete',
      parent: 'controls',
    },
  },
  {
    key: 'startEngineBtn',
    value: {
      tagName: 'button',
      classes: ['button--start-engine'],
      textContent: 'start',
      parent: 'controls',
    },
  },
  {
    key: 'stopEngineBtn',
    value: {
      tagName: 'button',
      classes: ['button--stop-engine'],
      textContent: 'stop',
      parent: 'controls',
    },
  },
  {
    key: 'image',
    value: {
      classes: ['car__image'],
      parent: 'container',
    },
  },
];
