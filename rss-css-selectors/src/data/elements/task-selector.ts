import type { BaseElement } from '../../utils/types';

export const selectorElements: BaseElement[] = [
  {
    key: 'section',
    value: {
      classes: ['selector', 'task__selector'],
    },
  },
  {
    key: 'title',
    value: {
      classes: ['selector__title'],
      textContent: 'CSS mind-breaker',
      parent: 'section',
    },
  },
  {
    key: 'header',
    value: {
      classes: ['selector__header'],
      parent: 'section',
    },
  },
  {
    key: 'arrow',
    value: {
      classes: ['selector__arrow'],
      parent: 'header',
    },
  },
  {
    key: 'current',
    value: {
      classes: ['selector__current'],
      parent: 'header',
    },
  },
  {
    key: 'levelList',
    value: {
      tagName: 'ul',
      classes: ['selector__levels'],
      parent: 'section',
      attributes: {
        style: 'max-height: 0px',
      },
    },
  },
];
