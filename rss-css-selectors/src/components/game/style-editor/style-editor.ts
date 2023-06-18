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
    this.elements.helpBtn = new ElementCreator({
      tagName: 'button',
      classes: ['style-editor__help-btn'],
      textContent: 'Help',
      parent: this.elements.body,
    }).getNode();
    this.elements.overlay = new ElementCreator({
      parent: document.body,
    }).getNode();
  }

  private addListeners(): void {
    this.elements.sumbitBtn.addEventListener(
      'click',
      this.checkInput.bind(this)
    );
    this.elements.helpBtn.addEventListener('click', this.showHelp.bind(this));
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
      this.showEffect('wrong-selector');
      console.log('wrong selector');
      return;
    }
    this.emitter.emit('lvl-done', this.currentLevelIndex);
    this.showEffect('correct-selector');
    console.log('correct selector');
    input.value = '';
    this.emitter.emit('correct-selector', this.currentLevelIndex);
    if (this.currentLevelIndex < levelsData.length - 1) {
      setTimeout(() => {
        this.emitter.emit('change-level', this.currentLevelIndex + 2);
        this.elements.overlay.classList.remove('overlay');
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

  private showEffect(effect: string): void {
    const value = effect === 'wrong-selector' ? '🗙' : '✓';
    this.elements.sumbitBtn.classList.toggle(
      `style-editor__submit-btn--${effect}`
    );
    this.elements.sumbitBtn.textContent = value;
    setTimeout(() => {
      this.elements.sumbitBtn.classList.toggle(
        `style-editor__submit-btn--${effect}`
      );
      this.elements.sumbitBtn.textContent = 'Submit';
    }, 800);
  }

  private showHelp(): void {
    this.emitter.emit('help-used', this.currentLevelIndex);
    if (this.currentLevelIndex + 1 === levelsData.length) return;
    this.elements.overlay.classList.add('overlay');
    const { selector } = levelsData[this.currentLevelIndex];
    const { input, sumbitBtn } = this.elements;
    if (!(input instanceof HTMLInputElement)) return;
    input.value = '';
    let i = 0;
    const typeEffect = (): void => {
      if (i < selector.length) {
        input.value += selector[i];
        i++;
        setTimeout(typeEffect, 75);
        return;
      }
      setTimeout(() => {
        sumbitBtn.click();
      }, 1500);
    };
    typeEffect();
  }
}
