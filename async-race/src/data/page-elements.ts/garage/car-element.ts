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
    key: 'startEngineBtn',
    value: {
      tagName: 'button',
      classes: ['car__button', 'car__button--start'],
      parent: 'controls',
    },
  },
  {
    key: 'stopEngineBtn',
    value: {
      tagName: 'button',
      classes: ['car__button', 'car__button--stop'],
      parent: 'controls',
    },
  },
  {
    key: 'modifyBtn',
    value: {
      tagName: 'button',
      classes: ['car__button', 'car__button--modify'],
      parent: 'controls',
    },
  },
  {
    key: 'deleteBtn',
    value: {
      tagName: 'button',
      classes: ['car__button', 'car__button--delete'],
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
  {
    key: 'road',
    value: {
      classes: ['car__road'],
      parent: 'container',
    },
  },
];
