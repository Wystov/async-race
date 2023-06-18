import type { StateData } from '../../utils/types';
import type { EventEmitter } from '../../utils/event-emitter';
import { levelsData } from '../../data/levels';

export class State {
  private readonly emitter;
  public settings: Partial<StateData> = {};

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    const saveData = this.getFromLS();
    this.settings.level = saveData.level ?? 1;
    this.settings.levelList =
      saveData.levelList ?? Array(levelsData.length - 1).fill('new');
    this.addListeners();
  }

  private getFromLS(): Partial<StateData> {
    const data = localStorage.getItem('css-selectors-game-wystov');
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    return {};
  }

  private saveToLS(): void {
    localStorage.setItem(
      'css-selectors-game-wystov',
      JSON.stringify(this.settings)
    );
  }

  private changeLevelState(data: number, state: string): void {
    if (this.settings.levelList?.[data] === 'new') {
      this.settings.levelList[data] = state;
    }
  }

  private resetProgress(): void {
    this.settings.level = 1;
    this.settings.levelList = Array(levelsData.length - 1).fill('new');
    this.emitter.emit('change-level', this.settings.level);
  }

  private addListeners(): void {
    this.emitter.on('change-level', (data: string) => {
      this.settings.level = parseInt(data, 10);
    });
    this.emitter.on('help-used', (data: number) => {
      this.changeLevelState(data, 'help-used');
    });
    this.emitter.on('lvl-done', (data: number) => {
      this.changeLevelState(data, 'lvl-done');
    });
    this.emitter.on('ask-levelList-state', () => {
      this.emitter.emit('send-levelList-state', this.settings.levelList);
    });
    this.emitter.on('reset-progress', this.resetProgress.bind(this));
    setTimeout(() => {
      this.emitter.emit('change-level', this.settings.level);
    }, 50);

    window.addEventListener('beforeunload', this.saveToLS.bind(this));
  }
}
