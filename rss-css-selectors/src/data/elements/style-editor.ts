import type { BaseElement } from '../../utils/types';
import { showCssData } from '../showCssData';

export const editorElements: BaseElement[] = [
  {
    key: 'section',
    value: {
      classes: ['style-editor', 'game__style-editor'],
    },
  },
  {
    key: 'title',
    value: {
      classes: ['style-editor__title'],
      textContent: 'style.css',
      parent: 'section',
    },
  },
  {
    key: 'body',
    value: {
      classes: ['style-editor__body'],
      parent: 'section',
    },
  },
  {
    key: 'input',
    value: {
      tagName: 'input',
      classes: ['style-editor__input'],
      parent: 'body',
      attributes: {
        type: 'text',
        placeholder: 'Type in CSS selector',
        spellcheck: 'false',
      },
    },
  },
  {
    key: 'highlightedCSS',
    value: {
      tagName: 'pre',
      classes: ['style-editor__highlighted-css', 'language-css'],
      parent: 'body',
    },
  },
  {
    key: 'cssStyles',
    value: {
      tagName: 'pre',
      classes: ['style-editor__css-styles', 'language-css'],
      parent: 'body',
      textContent: showCssData,
    },
  },
  {
    key: 'sumbitBtn',
    value: {
      tagName: 'button',
      classes: ['style-editor__submit-btn'],
      textContent: 'Submit',
      parent: 'body',
    },
  },
  {
    key: 'helpBtn',
    value: {
      tagName: 'button',
      classes: ['style-editor__help-btn'],
      textContent: 'Help',
      parent: 'body',
    },
  },
  {
    key: 'overlay',
    value: {
      parent: 'section',
    },
  },
];
