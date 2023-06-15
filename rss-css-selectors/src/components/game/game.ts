import { ElementCreator } from '../../utils/element-creator';
import { Visualizer } from './visualizer/visualizer';
import { StyleEditor } from './style-editor/style-editor';
import { HtmlViewer } from './html-viewer/html-viewer';

export class Game {
  private readonly game = new ElementCreator({ classes: ['game'] });
  private readonly visualizer = new Visualizer(this.game.getNode());
  private readonly styleEditor = new StyleEditor(this.game.getNode());
  private readonly htmlViewer = new HtmlViewer(this.game.getNode());

  constructor(root: HTMLElement) {
    root.append(this.game.getNode());
  }
}
