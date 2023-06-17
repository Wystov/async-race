import { ElementCreator } from '../../../utils/element-creator';
import type { EventEmitter } from '../../../utils/event-emitter';
import { levelsData } from '../../../data/levels';
import './_style-editor.scss';

export class StyleEditor {
  private readonly section;
  private readonly elements: Record<string, HTMLElement> = {};
  private readonly emitter: EventEmitter;
  private currentLevelIndex = 0;

  constructor(parent: HTMLElement, emitter: EventEmitter) {
    this.emitter = emitter;
    this.section = new ElementCreator({
      classes: ['style-editor', 'game__style-editor'],
    }).getNode();
    this.init();
    parent.append(this.section);
  }

  private init(): void {
    this.createElements();
    this.addListeners();
  }

  private createElements(): void {
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
    this.elements.input.setAttribute('placeholder', 'Type in CSS selector');
    this.elements.sumbitBtn = new ElementCreator({
      tagName: 'button',
      classes: ['style-editor__submit-btn'],
      textContent: 'Submit',
      parent: this.elements.body,
    }).getNode();
    setInterval(this.inputStrobe.bind(this), 530);
  }

  private inputStrobe(): void {
    this.elements.input.classList.toggle('style-editor__input--strobe');
    this.elements.input.focus();
  }

  private addListeners(): void {
    this.elements.sumbitBtn.addEventListener(
      'click',
      this.checkInput.bind(this)
    );
    this.elements.input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.elements.sumbitBtn.click();
      }
    });
    this.emitter.on('change-level', this.getCurrentLevelIndex.bind(this));
  }

  private getCurrentLevelIndex(data: string): void {
    this.currentLevelIndex = parseInt(data, 10) - 1;
  }

  private checkInput(): void {
    const { input } = this.elements;
    if (!(input instanceof HTMLInputElement)) return;
    const correctSelector = levelsData[this.currentLevelIndex].selector;

    const userSelectedElements = document.querySelectorAll(input.value);
    const correctElements = document.querySelectorAll(correctSelector);

    const isEqual = this.compareElements(userSelectedElements, correctElements);
    if (!isEqual) {
      console.log('wrong selector');
      return;
    }
    console.log('correct selector');
    input.value = '';
    if (this.currentLevelIndex < levelsData.length - 1) {
      setTimeout(() => {
        this.emitter.emit('change-level', this.currentLevelIndex + 2);
      }, 1000);
    }
  }

  private compareElements(
    userSelectedElements: NodeListOf<Element>,
    correctElements: NodeListOf<Element>
  ): boolean {
    for (let i = 0; i < correctElements.length; i++) {
      if (userSelectedElements[i] !== correctElements[i]) {
        return false;
      }
    }
    if (userSelectedElements.length === correctElements.length) {
      return true;
    }
    return false;
  }
}
