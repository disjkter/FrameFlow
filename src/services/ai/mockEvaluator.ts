import type { EvaluationIssue, EvaluationRequest, EvaluationResult, Evaluator } from './types';
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export class MockEvaluator implements Evaluator {
  async evaluate(request: EvaluationRequest): Promise<EvaluationResult> {
    await wait(700); let issues: EvaluationIssue[] = [];
    if (request.frameId === 'frame-02' && !request.sceneState.armCorrected) issues = [{ id: 'pose_001', category: 'pose', severity: 'medium', title: '角色右臂姿态不自然', description: '右臂向上弯折，与当前向右奔跑的发力方向不协调。', suggestion: '调整手肘方向，让右臂向后摆动，使奔跑动作更自然。', editPrompt: '修正人物右臂的奔跑姿态，保持角色其他部分和用户笔画不变', region: { x: .46, y: .43, width: .16, height: .22 } }];
    if (request.frameId === 'frame-03' && request.sceneState.capeColor !== 'red') issues = [{ id: 'consistency_001', category: 'consistency', severity: 'high', title: '斗篷颜色与前序帧不一致', description: '当前关键帧的斗篷为蓝色，而前两个关键帧均为红色。', suggestion: '将斗篷恢复为红色，保持角色标志性外观一致。', editPrompt: '将人物斗篷由蓝色修正为红色，保持姿态、背景和用户笔画不变', region: { x: .54, y: .57, width: .13, height: .24 } }];
    return { frameId: request.frameId, frameRevision: request.frameRevision, summary: issues.length ? `发现 ${issues.length} 个可修正问题` : '当前画面未发现预置场景问题', issues };
  }
}
export const evaluator: Evaluator = new MockEvaluator();
