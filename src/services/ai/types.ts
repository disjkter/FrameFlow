import type { Region, SceneState } from '../../types/editor';

export type IssueCategory = 'pose' | 'composition' | 'style' | 'consistency';
export type IssueSeverity = 'low' | 'medium' | 'high';
export interface EvaluationIssue { id: string; category: IssueCategory; severity: IssueSeverity; title: string; description: string; suggestion: string; editPrompt: string; region: Region }
export interface EvaluationRequest { frameId: string; frameRevision: number; sceneDescription: string; constraints: string[]; imageDataUrl: string; sceneState: SceneState }
export interface EvaluationResult { frameId: string; frameRevision: number; summary: string; issues: EvaluationIssue[] }
export interface Evaluator { evaluate(request: EvaluationRequest): Promise<EvaluationResult> }
export interface CorrectionRequest { frameId: string; frameRevision: number; issueId: string; imageDataUrl: string; region: Region; prompt: string; constraints: string[]; sceneState: SceneState }
export interface CorrectionResult { id: string; frameId: string; sourceRevision: number; correctionData: SceneState }
export interface ImageCorrector { correct(request: CorrectionRequest): Promise<CorrectionResult> }
