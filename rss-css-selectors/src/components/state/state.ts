import type { StateData } from '../../utils/types';
import type { EventEmitter } from '../../utils/event-emitter';
import { levelsData } from '../../data/levels';

export class State {
  private readonly settings: Partial<StateData> = {};

  constructor(private readonly emitter: EventEmitter) {
    this.init();
    this.addListeners();
    this.startGame();
  }

  private init(): void {
    const savedData = this.getFromLS();
    this.settings.level = savedData.level ?? 1;
    this.settings.levelStateList =
      savedData.levelStateList ?? Array(levelsData.length - 1).fill('new');
  }

  private getFromLS(): Partial<StateData> {
    const data = localStorage.getItem('css-selectors-game-wystov');
    const parsedData = data !== null ? JSON.parse(data) : {};
    return parsedData;
  }

  private saveToLS(): void {
    localStorage.setItem(
      'css-selectors-game-wystov',
      JSON.stringify(this.settings)
    );
  }

  private changeLevelState(data: number, state: string): void {
    const { levelStateList } = this.settings;
    if (levelStateList?.[data] === 'new') {
      levelStateList[data] = state;
    }
  }

  private resetProgress(): void {
    this.settings.level = 1;
    this.settings.levelStateList = Array(levelsData.length - 1).fill('new');
    this.emitter.emit('change-level', this.settings.level);
  }

  private addListeners(): void {
    this.emitter.on('change-level', (lvl: number) => {
      this.settings.level = lvl;
    });
    this.emitter.on('help-used', (lvl: number) => {
      this.changeLevelState(lvl, 'help-used');
    });
    this.emitter.on('lvl-done', (lvl: number) => {
      this.changeLevelState(lvl, 'lvl-done');
    });
    this.emitter.on('ask-levelList-state', this.sendLvlListState.bind(this));
    this.emitter.on('reset-progress', this.resetProgress.bind(this));
    window.addEventListener('beforeunload', this.saveToLS.bind(this));
  }

  private sendLvlListState(): void {
    this.emitter.emit('send-levelList-state', this.settings.levelStateList);
  }

  private startGame(): void {
    setTimeout(() => {
      this.emitter.emit('change-level', this.settings.level);
    }, 50);
  }
}
