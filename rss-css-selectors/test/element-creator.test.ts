import { ElementCreator } from '../src/utils/element-creator';

describe('ElementCreator', () => {
  const elementCreator = new ElementCreator({});
  const parent = new ElementCreator({}).getNode();
  const child = new ElementCreator({
    tagName: 'span',
    classes: ['test-span'],
    textContent: 'test text content',
    parent,
    attributes: {
      title: 'test title',
    },
  }).getNode();

  test('has method appendTo', () => {
    expect(typeof elementCreator.appendTo).toBe('function');
  });

  test('has method getNode', () => {
    expect(typeof elementCreator.getNode).toBe('function');
  });

  test('getNode returns a HTMLElement', () => {
    expect(elementCreator.getNode()).toBeInstanceOf(HTMLElement);
  });

  test('element creator creates correct element type', () => {
    expect(child.tagName).toBe('SPAN');
  });

  test('element creator adds correct class name', () => {
    expect(child.classList).toContain('test-span');
  });

  test('element creator adds correct text content', () => {
    expect(child.textContent).toBe('test text content');
  });

  test('appendTo can append child to parent', () => {
    expect(child.parentElement).toBe(parent);
  });

  test('private method setAttributes sets correct attributes', () => {
    expect(child.getAttribute('title')).toBe('test title');
  })
});
