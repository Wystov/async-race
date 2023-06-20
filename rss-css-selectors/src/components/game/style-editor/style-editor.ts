import hljs from 'highlight.js/lib/core';
import css from '../../../utils/hljs-rules/css';
import 'highlight.js/scss/atom-one-dark.scss';
import type { EventEmitter } from '../../../utils/event-emitter';
import { SectionCreator } from '../../../utils/section-creator';
import { editorElements } from '../../../data/elements/style-editor';
import { levelsData } from '../../../data/levels';
import './_style-editor.scss';

hljs.registerLanguage('css', css);

export class StyleEditor extends SectionCreator {
  private currentLevelIndex = 0;

  constructor(parent: HTMLElement, private readonly emitter: EventEmitter) {
    super(editorElements, parent);
    this.addListeners();
    hljs.highlightElement(this.elements.cssStyles);
  }

  private addListeners(): void {
    const { sumbitBtn, helpBtn, input } = this.elements;
    sumbitBtn.addEventListener('click', this.checkInput.bind(this));
    helpBtn.addEventListener('click', this.showHelp.bind(this));
    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') sumbitBtn.click();
    });
    this.emitter.on('change-level', this.setCurrentLevelIndex.bind(this));
    input.addEventListener('input', this.highlightCSS.bind(this));
  }

  private setCurrentLevelIndex(lvl: string): void {
    this.currentLevelIndex = parseInt(lvl, 10) - 1;
  }

  private checkInput(): void {
    const { input } = this.elements;
    if (!(input instanceof HTMLInputElement)) return;
    const correctSelector = levelsData[this.currentLevelIndex].selector;

    try {
      const userSelectedElements = document.querySelectorAll(input.value);
      const correctElements = document.querySelectorAll(correctSelector);
      const isEqual = this.compareElements(
        userSelectedElements,
        correctElements
      );
      if (!isEqual) throw new Error('Wrong selector');
    } catch (error) {
      this.showEffect('wrong-selector');
      return;
    }
    this.lvlDone();
  }

  private lvlDone(): void {
    const { input, highlightedCSS, overlay } = this.elements;
    if (!(input instanceof HTMLInputElement)) return;
    this.emitter.emit('lvl-done', this.currentLevelIndex);
    this.showEffect('correct-selector');
    input.value = '';
    highlightedCSS.textContent = '';
    this.emitter.emit('correct-selector', this.currentLevelIndex);
    if (this.currentLevelIndex < levelsData.length - 1) {
      setTimeout(() => {
        this.emitter.emit('change-level', this.currentLevelIndex + 2);
        overlay.classList.remove('overlay');
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
    return userSelectedElements.length === correctElements.length;
  }

  private showEffect(effect: string): void {
    const { sumbitBtn } = this.elements;
    const value = effect === 'wrong-selector' ? '🗙' : '✓';
    sumbitBtn.classList.toggle(`style-editor__submit-btn--${effect}`);
    sumbitBtn.textContent = value;
    setTimeout(() => {
      sumbitBtn.classList.toggle(`style-editor__submit-btn--${effect}`);
      sumbitBtn.textContent = 'Submit';
    }, 800);
  }

  private showHelp(): void {
    this.emitter.emit('help-used', this.currentLevelIndex);
    if (this.currentLevelIndex + 1 === levelsData.length) return;
    const { overlay, input } = this.elements;
    const { selector } = levelsData[this.currentLevelIndex];
    overlay.classList.add('overlay');
    if (!(input instanceof HTMLInputElement)) return;
    input.value = '';

    this.typeEffect(selector);
  }

  private typeEffect(selector: string): void {
    const { input, sumbitBtn } = this.elements;
    if (!(input instanceof HTMLInputElement)) return;
    let i = 0;
    const type = (): void => {
      if (i === selector.length) {
        setTimeout(() => {
          sumbitBtn.click();
        }, 1500);
        return;
      }
      input.value += selector[i];
      this.highlightCSS();
      i++;
      setTimeout(type, 75);
    };
    type();
  }

  private highlightCSS(): void {
    const { input, highlightedCSS } = this.elements;
    if (!(input instanceof HTMLInputElement)) return;
    highlightedCSS.textContent = input.value;
    hljs.highlightElement(highlightedCSS);
  }
}
