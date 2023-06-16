import { ElementCreator } from '../../../utils/element-creator';
import type { EventEmitter } from '../../../utils/event-emitter';

export class StyleEditor {
  private readonly section;
  private readonly elements: Record<string, HTMLElement> = {};
  private readonly emitter: EventEmitter;

  constructor(parent: HTMLElement, emitter: EventEmitter) {
    this.emitter = emitter;
    this.section = new ElementCreator({
      classes: ['style-editor', 'game__style-editor'],
    }).getNode();
    this.init();
    parent.append(this.section);
  }

  private init(): void {
    this.elements.title = new ElementCreator({
      classes: ['style-editor__title'],
      textContent: 'style.css',
      parent: this.section,
    }).getNode();
    this.elements.body = new ElementCreator({
      classes: ['style-editor__body'],
      parent: this.section,
    }).getNode();
    this.elements.input = new ElementCreator({
      tagName: 'input',
      classes: ['style-editor__input'],
      parent: this.elements.body,
    }).getNode();
    this.elements.input.setAttribute('type', 'text');
    this.elements.sumbitBtn = new ElementCreator({
      tagName: 'button',
      classes: ['style-editor__submit-btn'],
      textContent: 'Submit',
      parent: this.elements.body,
    }).getNode();
    this.elements.sumbitBtn.addEventListener(
      'click',
      this.checkInput.bind(this)
    );
  }

  private checkInput(): void {
    console.log('check input');
  }
}
