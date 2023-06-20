import type { BaseElement } from '../../utils/types';

export const viewerElements: BaseElement[] = [
  {
    key: 'section',
    value: {
      classes: ['html-viewer', 'game__html-viewer'],
    },
  },
  {
    key: 'title',
    value: {
      classes: ['html-viewer__title'],
      textContent: 'index.html',
      parent: 'section',
    },
  },
  {
    key: 'body',
    value: {
      classes: ['html-viewer__body'],
      parent: 'section',
    },
  },
  {
    key: 'code',
    value: {
      tagName: 'pre',
      classes: ['html-viewer__code', 'language-xml'],
      parent: 'body',
    },
  },
];
