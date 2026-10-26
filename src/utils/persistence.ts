import { useEditorStore } from '../stores/editorStore';
import type { AnimationFrame } from '../types/editor';

const STORAGE_KEY = 'frameflow:mvp:project:v1';
interface PersistedProject { projectId: string; projectName: string; sceneDescription: string; constraints: string[]; activeFrameId: string; frames: AnimationFrame[]; brushColor: string; brushSize: number }

export function initializePersistence() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved) as PersistedProject;
      if (Array.isArray(data.frames) && data.frames.length === 3) useEditorStore.setState({ ...data, evaluationStatus: 'idle', evaluationResult: null, evaluationError: null, correctionStatus: 'idle', correctionCandidate: null, correctionError: null, selectedIssueId: null, selectedRegion: null });
    }
  } catch { useEditorStore.setState({ storageWarning: '本地项目读取失败，已使用默认演示数据。' }); }
  return useEditorStore.subscribe((state) => {
    try {
      const data: PersistedProject = { projectId: state.projectId, projectName: state.projectName, sceneDescription: state.sceneDescription, constraints: state.constraints, activeFrameId: state.activeFrameId, frames: state.frames, brushColor: state.brushColor, brushSize: state.brushSize };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (state.storageWarning) useEditorStore.setState({ storageWarning: null });
    } catch { if (!useEditorStore.getState().storageWarning) useEditorStore.setState({ storageWarning: '本地存储空间不足，本次更改可能无法在刷新后恢复。' }); }
  });
}

export const clearPersistedProject = () => localStorage.removeItem(STORAGE_KEY);
