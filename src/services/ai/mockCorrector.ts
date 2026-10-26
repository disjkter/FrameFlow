import type { CorrectionRequest, CorrectionResult, ImageCorrector } from './types';
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const overlaps = (a: CorrectionRequest['region'], b: CorrectionRequest['region']) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
export class MockImageCorrector implements ImageCorrector {
  async correct(request: CorrectionRequest): Promise<CorrectionResult> {
    await wait(900);
    const targets = { pose_001: { x: .46, y: .43, width: .16, height: .22 }, consistency_001: { x: .54, y: .57, width: .13, height: .24 } };
    const target = targets[request.issueId as keyof typeof targets];
    if (!target || !overlaps(request.region, target)) throw new Error('所选区域未覆盖预置问题，请重新定位或框选。');
    const correctionData = { ...request.sceneState };
    if (request.issueId === 'pose_001') correctionData.armCorrected = true;
    if (request.issueId === 'consistency_001') correctionData.capeColor = 'red';
    return { id: `candidate-${Date.now()}`, frameId: request.frameId, sourceRevision: request.frameRevision, correctionData };
  }
}
export const imageCorrector: ImageCorrector = new MockImageCorrector();
