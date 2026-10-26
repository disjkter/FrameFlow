import { create } from 'zustand';
import { createDefaultFrames, DEFAULT_CONSTRAINTS, DEFAULT_SCENE_DESCRIPTION } from '../scenes/demoData';
import type { CorrectionResult, EvaluationIssue, EvaluationResult } from '../services/ai/types';
import type { AnimationFrame, FrameSnapshot, Region, Stroke, Tool } from '../types/editor';
const snapshot = (f: AnimationFrame): FrameSnapshot => ({ strokes: f.strokes.map((s) => ({ ...s, points: [...s.points] })), scene: { ...f.scene }, revision: f.revision });
const updateActive = (frames: AnimationFrame[], id: string, update: (f: AnimationFrame) => AnimationFrame) => frames.map((f) => f.id === id ? update(f) : f);
export interface EditorStore {
  projectId: string; projectName: string; sceneDescription: string; constraints: string[]; activeFrameId: string; frames: AnimationFrame[];
  activeTool: Tool; brushColor: string; brushSize: number; selectedRegion: Region | null; storageWarning: string | null; selectedIssueId: string | null;
  evaluationStatus: 'idle' | 'loading' | 'success' | 'error'; evaluationResult: EvaluationResult | null; evaluationError: string | null;
  correctionStatus: 'idle' | 'loading' | 'preview' | 'error'; correctionCandidate: CorrectionResult | null; correctionError: string | null;
  setActiveFrame(id: string): void; setTool(tool: Tool): void; setBrushColor(color: string): void; setBrushSize(size: number): void; setSceneDescription(value: string): void; setSelectedRegion(region: Region | null): void;
  addStroke(stroke: Stroke): void; undo(): void; redo(): void; reset(): void; startEvaluation(): void; finishEvaluation(result: EvaluationResult): boolean; failEvaluation(message: string): void;
  selectIssue(issue: EvaluationIssue | null): void; ignoreIssue(id: string): void; startCorrection(): void; finishCorrection(candidate: CorrectionResult): boolean; failCorrection(message: string): void; clearCorrection(): void; acceptCorrection(): boolean;
}
const transient = { selectedIssueId: null, evaluationStatus: 'idle' as const, evaluationResult: null, evaluationError: null, correctionStatus: 'idle' as const, correctionCandidate: null, correctionError: null };
export const useEditorStore = create<EditorStore>((set, get) => ({
  projectId: 'forest-run', projectName: '森林奔跑', sceneDescription: DEFAULT_SCENE_DESCRIPTION, constraints: DEFAULT_CONSTRAINTS, activeFrameId: 'frame-01', frames: createDefaultFrames(), activeTool: 'select', brushColor: '#f8fafc', brushSize: 7, selectedRegion: null, storageWarning: null, ...transient,
  setActiveFrame: (activeFrameId) => set({ activeFrameId, selectedRegion: null, ...transient }), setTool: (activeTool) => set({ activeTool }), setBrushColor: (brushColor) => set({ brushColor }), setBrushSize: (brushSize) => set({ brushSize }), setSceneDescription: (sceneDescription) => set({ sceneDescription }), setSelectedRegion: (selectedRegion) => set({ selectedRegion }),
  addStroke: (stroke) => { const s = get(); set({ frames: updateActive(s.frames, s.activeFrameId, (f) => ({ ...f, history: [...f.history, snapshot(f)], future: [], strokes: [...f.strokes, stroke], revision: f.revision + 1 })), evaluationResult: null, selectedIssueId: null, correctionCandidate: null, correctionStatus: 'idle' }); },
  undo: () => { const s = get(); set({ frames: updateActive(s.frames, s.activeFrameId, (f) => { const previous = f.history.at(-1); return previous ? { ...f, ...previous, history: f.history.slice(0, -1), future: [snapshot(f), ...f.future] } : f; }), evaluationResult: null, selectedIssueId: null, correctionCandidate: null, correctionStatus: 'idle' }); },
  redo: () => { const s = get(); set({ frames: updateActive(s.frames, s.activeFrameId, (f) => { const next = f.future[0]; return next ? { ...f, ...next, history: [...f.history, snapshot(f)], future: f.future.slice(1) } : f; }), evaluationResult: null, selectedIssueId: null, correctionCandidate: null, correctionStatus: 'idle' }); },
  startEvaluation: () => set({ evaluationStatus: 'loading', evaluationError: null, evaluationResult: null, selectedIssueId: null, correctionStatus: 'idle', correctionCandidate: null }),
  finishEvaluation: (result) => { const s = get(), f = getActiveFrame(s); if (s.activeFrameId !== result.frameId || f.revision !== result.frameRevision) { set({ evaluationStatus: 'idle', evaluationError: '画布已发生变化，本次评估结果已过期。' }); return false; } set({ evaluationStatus: 'success', evaluationResult: result }); return true; },
  failEvaluation: (evaluationError) => set({ evaluationStatus: 'error', evaluationError }),
  selectIssue: (issue) => set({ selectedIssueId: issue?.id ?? null, selectedRegion: issue?.region ?? null, correctionStatus: 'idle', correctionCandidate: null, correctionError: null }),
  ignoreIssue: (id) => set((s) => ({ evaluationResult: s.evaluationResult ? { ...s.evaluationResult, issues: s.evaluationResult.issues.filter((i) => i.id !== id) } : null, selectedIssueId: s.selectedIssueId === id ? null : s.selectedIssueId, selectedRegion: s.selectedIssueId === id ? null : s.selectedRegion })),
  startCorrection: () => set({ correctionStatus: 'loading', correctionCandidate: null, correctionError: null }),
  finishCorrection: (candidate) => { const s = get(), f = getActiveFrame(s); if (s.activeFrameId !== candidate.frameId || f.revision !== candidate.sourceRevision) { set({ correctionStatus: 'error', correctionError: '画布已发生变化，候选结果已过期，请重新生成。' }); return false; } set({ correctionStatus: 'preview', correctionCandidate: candidate }); return true; },
  failCorrection: (correctionError) => set({ correctionStatus: 'error', correctionError }), clearCorrection: () => set({ correctionStatus: 'idle', correctionCandidate: null, correctionError: null }),
  acceptCorrection: () => { const s = get(), c = s.correctionCandidate, f = getActiveFrame(s); if (!c || c.frameId !== f.id || c.sourceRevision !== f.revision) { set({ correctionStatus: 'error', correctionError: '候选结果已过期，未对画布做任何修改。' }); return false; } set({ frames: updateActive(s.frames, s.activeFrameId, (current) => ({ ...current, history: [...current.history, snapshot(current)], future: [], scene: { ...c.correctionData }, revision: current.revision + 1 })), selectedRegion: null, ...transient }); return true; },
  reset: () => set({ sceneDescription: DEFAULT_SCENE_DESCRIPTION, constraints: DEFAULT_CONSTRAINTS, activeFrameId: 'frame-01', frames: createDefaultFrames(), activeTool: 'select', selectedRegion: null, storageWarning: null, ...transient }),
}));
export const getActiveFrame = (state: Pick<EditorStore, 'frames' | 'activeFrameId'>) => state.frames.find((f) => f.id === state.activeFrameId)!;
