export const createCarPopupData = [
  {
    key: 'container',
    value: {
      classes: ['car-creation__container'],
    },
  },
  {
    key: 'nameInput',
    value: {
      tagName: 'input',
      classes: ['car-creation__name-input'],
      attributes: {
        type: 'text',
      },
      parent: 'container',
    },
  },
  {
    key: 'colorPicker',
    value: {
      tagName: 'input',
      classes: ['car-creation__color-picker'],
      attributes: {
        type: 'color',
      },
      parent: 'container',
    },
  },
  {
    key: 'createBtn',
    value: {
      tagName: 'button',
      classes: ['car-creation__submit-btn'],
      textContent: 'create',
      parent: 'container',
    },
  },
];
