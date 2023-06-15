import { ElementCreator } from '../../../utils/element-creator';

export class StyleEditor {
  private readonly styleEditor = new ElementCreator({
    classes: ['game__style-editor'],
  });

  constructor(parent: HTMLElement) {
    parent.append(this.styleEditor.getNode());
  }
}
