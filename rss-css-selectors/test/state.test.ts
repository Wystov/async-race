import { State } from '../src/components/state/state';
import { EventEmitter } from '../src/utils/event-emitter';
import { levelsData } from '../src/data/levels';

describe('State', () => {
  const emitter = new EventEmitter();
  const state = new State(emitter);
  const newLvlListState = Array(levelsData.length - 1).fill('new');

  test('has method init', () => {
    expect(typeof state['init']).toBe('function');
  });

  test('init method set default if no data found in local storage', () => {
    expect(state['settings']['level']).toEqual(1);
    expect(state['settings']['levelStateList']).toEqual(newLvlListState);
  });

  test('has method getFromLS', () => {
    expect(typeof state['getFromLS']).toBe('function');
  });

  test('getFromLS method returns empty object if no data found in local storage', () => {
    expect(state['getFromLS']()).toEqual({});
  });

  test('has method saveToLS', () => {
    expect(typeof state['saveToLS']).toBe('function');
  });

  test('saveToLS method saves data to local storage', () => {
    state['saveToLS']();
    expect(localStorage.getItem('css-selectors-game-wystov')).toEqual(JSON.stringify(state['settings']));
  });

  test('getFromLS method returns data from local storage', () => {
    expect(state['getFromLS']()).toEqual(state['settings']);
  });

  test('has method changeLevelState', () => {
    expect(typeof state['changeLevelState']).toBe('function');
  });

  test('changeLevelState method changes level state', () => {
    state['changeLevelState'](0, 'help-used');
    expect(state?.['settings']?.['levelStateList']?.[0]).toEqual('help-used');
  });

  test("changeLevelState method doesn't change level state if level is not new", () => {
    state['changeLevelState'](0, 'lvl-done');
    expect(state?.['settings']?.['levelStateList']?.[0]).toEqual('help-used');
  });

  test('has method resetProgress', () => {
    expect(typeof state['resetProgress']).toBe('function');
  });

  test('resetProgress method resets progress', () => {
    state['resetProgress']();
    expect(state?.['settings']?.['level']).toEqual(1);
    expect(state?.['settings']?.['levelStateList']).toEqual(newLvlListState);
  });

  test('has method addListeners', () => {
    expect(typeof state['addListeners']).toBe('function');
  });

  test('addListeners method adds all listeners', () => {
    const eventList = ['change-level', 'help-used', 'lvl-done', 'ask-levelList-state', 'reset-progress'];
    state['addListeners']();
    expect(Object.keys(emitter.events)).toEqual(eventList);
  });
})