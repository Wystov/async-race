import type { BaseElement } from '../../utils/types';
import { levelsData } from '../levels';

export const descriptionElements: BaseElement[] = [
  {
    key: 'section',
    value: {
      classes: ['description', 'task__description'],
    },
  },
  {
    key: 'title',
    value: {
      classes: ['description__title'],
      textContent: levelsData[0].title,
      parent: 'section',
    },
  },
  {
    key: 'description',
    value: {
      classes: ['description__text'],
      textContent: levelsData[0].description,
      parent: 'section',
    },
  },
  {
    key: 'footer',
    value: {
      classes: ['description__footer'],
      parent: 'section',
    },
  },
  {
    key: 'github',
    value: {
      tagName: 'a',
      classes: ['footer__github'],
      parent: 'footer',
      attributes: {
        href: 'https://github.com/Wystov',
        target: '_blank',
      },
    },
  },
  {
    key: 'year',
    value: {
      tagName: 'span',
      classes: ['footer__year'],
      textContent: '2023',
      parent: 'footer',
    },
  },
  {
    key: 'rss',
    value: {
      tagName: 'a',
      classes: ['footer__rss'],
      parent: 'footer',
      attributes: {
        href: 'https://rs.school/js/',
        target: '_blank',
      },
    },
  },
];
