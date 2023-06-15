import { ElementCreator } from '../../../utils/element-creator';

export class Visualizer {
  private readonly visualizer = new ElementCreator({
    classes: ['game__visualizer'],
  });

  constructor(parent: HTMLElement) {
    parent.append(this.visualizer.getNode());
  }
}
