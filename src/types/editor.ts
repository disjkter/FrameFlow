export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 540;

export type Tool = 'select' | 'brush' | 'eraser' | 'region';

export interface Point { x: number; y: number }
export interface Region { x: number; y: number; width: number; height: number }

export interface Stroke {
  id: string;
  points: number[];
  color: string;
  width: number;
  composite: 'source-over' | 'destination-out';
}

export interface SceneState {
  pose: 'ready' | 'running' | 'landing';
  armCorrected: boolean;
  capeColor: 'red' | 'blue';
}

export interface FrameSnapshot {
  strokes: Stroke[];
  scene: SceneState;
  revision: number;
}

export interface AnimationFrame extends FrameSnapshot {
  id: string;
  number: string;
  name: string;
  description: string;
  history: FrameSnapshot[];
  future: FrameSnapshot[];
}
