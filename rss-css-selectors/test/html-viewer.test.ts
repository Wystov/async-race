import { HtmlViewer } from '../src/components/game/html-viewer/html-viewer';
import { EventEmitter } from '../src/utils/event-emitter';
import { ElementCreator } from '../src/utils/element-creator';

describe('HtmlViewer', () => {
  const emitter = new EventEmitter();
  const parent = document.createElement('div');
  const htmlViewer = new HtmlViewer(parent, emitter);

  test('has method addListeners', () => {
    expect(typeof htmlViewer['addListeners']).toBe('function');
  });

  test('method addListeners adds all listeners', () => {
    const eventList = ['change-level', 'element-hovered', 'element-unhovered'];
    htmlViewer['addListeners']();
    expect(Object.keys(emitter.events)).toEqual(eventList);
  });

  test('listeners work on calling', () => {
    const testChangeLevel = jest.fn();
    const testAddHover = jest.fn();
    htmlViewer['changeLevel'] = testChangeLevel;
    htmlViewer['addHover'] = testAddHover;

    emitter.emit('change-level', 1);
    emitter.emit('element-hovered', 2);

    expect(testChangeLevel).toBeCalledWith(1);
    expect(testAddHover).toBeCalledWith(2);
  })

  test('has method extractMarkup', () => {
    expect(typeof htmlViewer['extractMarkup']).toBe('function');
  });

  test('method extractMarkup returns html in right format', () => {
    const start = `<circle></circle><triangle></triangle><square></square><underscore></underscore><border></border>`;
    const end = `<circle /><triangle /><square /><underscore /><border></border>`;
    expect(htmlViewer['extractMarkup'](start)).toEqual(end);
  });

  test('findTargetElement should return the correct HTMLElement', () => {
    const parent = document.createElement('div');
    htmlViewer['elements'].code = parent;
    const child = document.createElement('div');
    parent.append(child);
    expect(htmlViewer['findTargetElement'](1)).toBe(child);
  });

  test('findTargetElement should return null if result is not HTMLelement', () => {
    htmlViewer['elements'].code = document.createElement('div');
    expect(htmlViewer['findTargetElement'](1)).toBeNull();
  });

  test('removeHover should remove hover class and delete related property from object', () => {
    const hovered = new ElementCreator({ classes: ['code-hover'] }).getNode();
    const hoveredPair = new ElementCreator({ classes: ['code-hover'] }).getNode();
    htmlViewer['elements'].hovered = hovered;
    htmlViewer['elements'].hoveredPair = hoveredPair;

    htmlViewer['removeHover']();

    expect(hovered.classList).not.toContain('code-hover');
    expect(hoveredPair.classList).not.toContain('code-hover');
    expect(htmlViewer['elements'].hovered).toBe(undefined);
    expect(htmlViewer['elements'].hoveredPair).toBe(undefined);
  })
});
