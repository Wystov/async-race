import type { BaseElement } from '../../utils/types';

export const visualizerElements: BaseElement[] = [
  {
    key: 'section',
    value: {
      classes: ['visualizer', 'game__visualizer'],
    },
  },
  {
    key: 'title',
    value: {
      classes: ['visualizer__title'],
      textContent: 'Live server',
      parent: 'section',
    },
  },
  {
    key: 'body',
    value: {
      classes: ['visualizer__body'],
      parent: 'section',
    },
  },
  {
    key: 'task',
    value: {
      classes: ['visualizer__task'],
      parent: 'body',
    },
  },
  {
    key: 'viewContainer',
    value: {
      classes: ['visualizer__view-container'],
      parent: 'body',
    },
  },
];
