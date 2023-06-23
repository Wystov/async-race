import { EventEmitter } from '../utils/event-emitter';
import { State } from './state/state';
import { ElementCreator } from '../utils/element-creator';
import { TaskSelector } from './tasks/task-selector/task-selector';
import { TaskDescription } from './tasks/task-description/task-description';
import { Visualizer } from './game/visualizer/visualizer';
import { StyleEditor } from './game/style-editor/style-editor';
import { HtmlViewer } from './game/html-viewer/html-viewer';
import type { Task, Game } from '../utils/types';
import './tasks/_tasks.scss';
import './game/_game.scss';

export class App {
  private readonly emitter = new EventEmitter();
  private readonly state = new State(this.emitter);
  private readonly task: Partial<Task> = {};
  private readonly game: Partial<Game> = {};

  constructor() {
    const root = new ElementCreator({ classes: ['container'] }).getNode();
    this.createTask(root);
    this.createGame(root);
    document.body.append(root);
    this.emitter.on('change-level', this.scrollToTop);
  }

  private createTask(root: HTMLElement): void {
    const taskElement = new ElementCreator({
      tagName: 'aside',
      classes: ['task'],
    }).getNode();
    this.task.selector = new TaskSelector(taskElement, this.emitter);
    this.task.description = new TaskDescription(taskElement, this.emitter);
    root.append(taskElement);
  }

  private createGame(root: HTMLElement): void {
    const gameElement = new ElementCreator({
      tagName: 'main',
      classes: ['game'],
    }).getNode();
    this.game.visualizer = new Visualizer(gameElement, this.emitter);
    this.game.styleEditor = new StyleEditor(gameElement, this.emitter);
    this.game.htmlViewer = new HtmlViewer(gameElement, this.emitter);
    root.append(gameElement);
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
