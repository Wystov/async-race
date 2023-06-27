import { TaskDescription } from '../src/components/tasks/task-description/task-description';
import { levelsData } from '../src/data/levels';
import { EventEmitter } from '../src/utils/event-emitter';

describe('TaskDesctiption', () => {
  const emitter = new EventEmitter();
  const parent = document.createElement('div');
  const taskDescription = new TaskDescription(parent, emitter);
  taskDescription['elements'].title = document.createElement('div');
  taskDescription['elements'].description = document.createElement('div');

  test('has method changeLevel', () => {
    expect(typeof taskDescription['changeLevel']).toBe('function');
  });

  test('changeLevel method changes task and description', () => {
    taskDescription['changeLevel'](1);
    expect(taskDescription['elements'].title.textContent).toEqual(levelsData[0].title);
    expect(taskDescription['elements'].description.textContent).toEqual(levelsData[0].description);
  });
});
