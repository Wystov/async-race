import type { StateData } from '../../utils/types';
import type { EventEmitter } from '../../utils/event-emitter';

export class State {
  private readonly emitter;
  public settings: Partial<StateData> = {};

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    const saveData = this.getFromLS();
    this.settings.level = saveData.level ?? 1;
    emitter.emit('change-level', this.settings.level);
    emitter.on('change-level', (data: string) => {
      this.settings.level = parseInt(data, 10);
    });
    window.addEventListener('beforeunload', this.saveToLS.bind(this));
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
}
