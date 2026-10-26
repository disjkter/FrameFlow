import { describe, expect, it, vi } from 'vitest';
import { MockEvaluator } from './mockEvaluator';
import { MockImageCorrector } from './mockCorrector';

describe('Mock AI 服务', () => {
  it('识别 Frame 02 姿态问题及修正后的无问题状态', async () => {
    vi.useFakeTimers(); const service = new MockEvaluator();
    const request = { frameId: 'frame-02', frameRevision: 0, sceneDescription: '', constraints: [], imageDataUrl: '', sceneState: { pose: 'running' as const, armCorrected: false, capeColor: 'red' as const } };
    const pending = service.evaluate(request); await vi.runAllTimersAsync(); expect((await pending).issues[0].id).toBe('pose_001');
    const fixed = service.evaluate({ ...request, sceneState: { ...request.sceneState, armCorrected: true } }); await vi.runAllTimersAsync(); expect((await fixed).issues).toHaveLength(0); vi.useRealTimers();
  });
  it('修正 Frame 03 斗篷并验证选区', async () => {
    vi.useFakeTimers(); const service = new MockImageCorrector();
    const base = { frameId: 'frame-03', frameRevision: 0, issueId: 'consistency_001', imageDataUrl: '', prompt: '', constraints: [], sceneState: { pose: 'landing' as const, armCorrected: false, capeColor: 'blue' as const } };
    const pending = service.correct({ ...base, region: { x: .54, y: .57, width: .13, height: .24 } }); await vi.runAllTimersAsync(); expect((await pending).correctionData.capeColor).toBe('red');
    const invalid = service.correct({ ...base, region: { x: 0, y: 0, width: .1, height: .1 } }); const rejection = expect(invalid).rejects.toThrow('未覆盖'); await vi.runAllTimersAsync(); await rejection; vi.useRealTimers();
  });
});
