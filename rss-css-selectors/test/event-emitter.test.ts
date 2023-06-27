import { EventEmitter } from '../src/utils/event-emitter';

describe('EventEmitter', () => {
  const eventEmitter = new EventEmitter();
  const callback = jest.fn();
  eventEmitter.on('test-event', callback);

  test('has method on', () => {
    expect(typeof eventEmitter.on).toBe('function');
  });

  test('has method emit', () => {
    expect(typeof eventEmitter.emit).toBe('function');
  });

  test('on method correctly subscribes to event', () => {
    expect(eventEmitter.events.hasOwnProperty('test-event')).toBe(true);
  });

  test('on method correctly adds callback function', () => {
    expect(eventEmitter.events['test-event'][0]).toBe(callback);
  });

  test('emit method correctly emits event and passing args to subscribers callback function', () => {
    eventEmitter.emit('test-event', 'test')
    expect(callback).toHaveBeenCalledWith('test');
  });

  test('emit method throws on calling non-existing event', () => {
    expect(() => eventEmitter.emit('no-such-event', 'test')).toThrow("Can't find event to emit");
  });
});
