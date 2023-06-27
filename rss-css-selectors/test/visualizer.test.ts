import { Visualizer } from '../src/components/game/visualizer/visualizer';
import { EventEmitter } from '../src/utils/event-emitter';

describe('Visualizer', () => {
  const parent = document.createElement('div');
  const emitter = new EventEmitter();
  const visualizer = new Visualizer(parent, emitter)

  test('has method addListeners', () => {
    expect(typeof visualizer['addListeners']).toBe('function');
  });

  test('method addListeners adds all listeners', () => {
    const eventList = ['change-level', 'correct-selector', 'code-hovered', 'code-unhovered'];
    visualizer['addListeners']();
    expect(Object.keys(emitter.events)).toEqual(eventList);
  });
})