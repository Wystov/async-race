import { ElementCreator } from '../../../utils/element-creator';

export class HtmlViewer {
  private readonly htmlViewer = new ElementCreator({
    classes: ['game__html-viewer'],
  });

  constructor(parent: HTMLElement) {
    parent.append(this.htmlViewer.getNode());
  }
}
