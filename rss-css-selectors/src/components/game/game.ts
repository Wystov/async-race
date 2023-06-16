import './_game.scss';
import { ElementCreator } from '../../utils/element-creator';
import { Visualizer } from './visualizer/visualizer';
import { StyleEditor } from './style-editor/style-editor';
import { HtmlViewer } from './html-viewer/html-viewer';
import type { EventEmitter } from '../../utils/event-emitter';

export class Game {
  private readonly game = new ElementCreator({ classes: ['game'] }).getNode();
  private readonly visualizer;
  private readonly styleEditor;
  private readonly htmlViewer;

  constructor(root: HTMLElement, emitter: EventEmitter) {
    this.visualizer = new Visualizer(this.game, emitter);
    this.styleEditor = new StyleEditor(this.game, emitter);
    this.htmlViewer = new HtmlViewer(this.game, emitter);
    root.append(this.game);
  }
}
