import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultFrames } from '../scenes/demoData';
import type { EvaluationResult } from '../services/ai/types';
import { getActiveFrame, useEditorStore } from './editorStore';

const stroke = { id: 's1', points: [0, 0, 10, 10], color: '#fff', width: 4, composite: 'source-over' as const };
beforeEach(() => useEditorStore.getState().reset());

describe('编辑器状态', () => {
  it('按帧保存笔画并支持撤销重做', () => {
    useEditorStore.getState().addStroke(stroke);
    expect(getActiveFrame(useEditorStore.getState()).strokes).toHaveLength(1);
    useEditorStore.getState().setActiveFrame('frame-02'); useEditorStore.getState().setActiveFrame('frame-01');
    expect(getActiveFrame(useEditorStore.getState()).strokes).toHaveLength(1);
    useEditorStore.getState().undo(); expect(getActiveFrame(useEditorStore.getState()).strokes).toHaveLength(0);
    useEditorStore.getState().redo(); expect(getActiveFrame(useEditorStore.getState()).strokes).toHaveLength(1);
  });
  it('拒绝接收过期评估结果', () => {
    const result: EvaluationResult = { frameId: 'frame-01', frameRevision: 0, summary: 'ok', issues: [] };
    useEditorStore.getState().startEvaluation(); useEditorStore.getState().addStroke(stroke);
    expect(useEditorStore.getState().finishEvaluation(result)).toBe(false);
    expect(useEditorStore.getState().evaluationResult).toBeNull();
  });
  it('接受 AI 修正后可撤销与重做', () => {
    useEditorStore.getState().setActiveFrame('frame-03');
    useEditorStore.getState().finishCorrection({ id: 'c1', frameId: 'frame-03', sourceRevision: 0, correctionData: { ...createDefaultFrames()[2].scene, capeColor: 'red' } });
    expect(useEditorStore.getState().acceptCorrection()).toBe(true);
    expect(getActiveFrame(useEditorStore.getState()).scene.capeColor).toBe('red');
    useEditorStore.getState().undo(); expect(getActiveFrame(useEditorStore.getState()).scene.capeColor).toBe('blue');
    useEditorStore.getState().redo(); expect(getActiveFrame(useEditorStore.getState()).scene.capeColor).toBe('red');
  });
});
