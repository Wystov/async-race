import type { TaskSelector } from '../components/tasks/task-selector/task-selector';
import type { TaskDescription } from '../components/tasks/task-description/task-description';
import type { Visualizer } from '../components/game/visualizer/visualizer';
import type { StyleEditor } from '../components/game/style-editor/style-editor';
import type { HtmlViewer } from '../components/game/html-viewer/html-viewer';

export interface BaseElement {
  key: string;
  value: BaseElementOptions;
}

export interface BaseElementOptions {
  tagName?: string;
  classes?: string[];
  textContent?: string;
  parent?: HTMLElement | string | null;
  attributes?: Record<string, string> | null;
}

export interface StateData {
  level: number;
  levelStateList: string[];
}

export interface Task {
  selector: TaskSelector;
  description: TaskDescription;
}

export interface Game {
  visualizer: Visualizer;
  styleEditor: StyleEditor;
  htmlViewer: HtmlViewer;
}

export type ObjectKey = keyof TaskSelector | keyof TaskDescription;

export type ElementList = Record<string, HTMLElement>;

export type ResolvePath = HTMLElement | ElementList;
