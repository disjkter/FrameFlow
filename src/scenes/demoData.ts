import type { AnimationFrame } from '../types/editor';

export const DEFAULT_SCENE_DESCRIPTION = '一个穿红色斗篷的小女孩，在森林中向右奔跑。保持日系二维动画风格、动作自然、人物比例协调，并在关键帧之间保持角色外观一致。';

export const DEFAULT_CONSTRAINTS = [
  '角色斗篷始终保持红色',
  '人物始终面向右方',
  '保持统一的二维动画风格',
  '关键帧之间保持角色外观一致',
];

export function createDefaultFrames(): AnimationFrame[] {
  const make = (id: string, number: string, name: string, description: string, pose: AnimationFrame['scene']['pose'], capeColor: 'red' | 'blue'): AnimationFrame => ({
    id, number, name, description, strokes: [], revision: 0, history: [], future: [],
    scene: { pose, armCorrected: false, capeColor },
  });
  return [
    make('frame-01', '01', '准备起跑', '人物压低重心，准备向右起跑', 'ready', 'red'),
    make('frame-02', '02', '正在奔跑', '人物正在森林中向右奔跑', 'running', 'red'),
    make('frame-03', '03', '跳跃落地', '人物越过树根后轻盈落地', 'landing', 'blue'),
  ];
}
