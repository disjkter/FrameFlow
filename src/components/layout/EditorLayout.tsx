import type { ReactNode } from 'react';
import { Clapperboard, RotateCcw, Sparkles } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { exportCanvasPng } from '../../utils/canvas';
import { Toolbar } from '../editor/Toolbar';
import { EditorCanvas } from '../editor/EditorCanvas';
import { FrameTimeline } from '../editor/FrameTimeline';

export function EditorLayout({ assistant }: { assistant: ReactNode }) {
  const store = useEditorStore();
  const reset = () => { if (window.confirm('确定重置演示项目吗？所有绘画和修改历史都将清除。')) store.reset(); };
  const exportPng = () => exportCanvasPng(`frameflow-${store.activeFrameId}.png`);
  return <main className="app-shell">
    <header className="topbar"><div className="brand"><div className="brand-mark"><Clapperboard size={21}/></div><div><strong>FrameFlow</strong><span>AI 动画分镜协作编辑器</span></div></div><div className="project-pill"><span>当前项目</span><strong>{store.projectName}</strong></div><div className="top-actions"><div className="mock-badge"><Sparkles size={14}/>Mock AI</div><button className="ghost-button" onClick={reset}><RotateCcw size={16}/>重置演示</button><button className="primary-button" onClick={exportPng}>导出 PNG</button></div></header>
    {store.storageWarning && <div className="storage-warning">{store.storageWarning}</div>}
    <div className="workspace"><Toolbar/><section className="stage-column"><div className="stage-header"><div><span className="eyebrow">当前镜头</span><h1>{useEditorStore.getState().frames.find(f => f.id === store.activeFrameId)?.name}</h1></div><span className="stage-hint">16:9 · 可编辑画布</span></div><EditorCanvas/></section>{assistant}</div>
    <FrameTimeline/>
  </main>;
}
