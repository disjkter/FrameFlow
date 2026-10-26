import { Check, Film } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';

export function FrameTimeline() {
  const { frames, activeFrameId, setActiveFrame } = useEditorStore();
  return <section className="timeline panel"><div className="timeline-title"><Film size={17}/><div><span className="eyebrow">动画关键帧</span><strong>3 个叙事节点</strong></div></div><div className="frame-list">{frames.map((frame) => <button key={frame.id} className={`frame-card ${frame.id === activeFrameId ? 'active' : ''}`} onClick={() => setActiveFrame(frame.id)}><div className="frame-number">{frame.number}</div><div><strong>{frame.name}</strong><span>{frame.description}</span></div>{frame.id === activeFrameId && <Check className="frame-check" size={16}/>}<i>{frame.strokes.length ? `${frame.strokes.length} 笔` : '原始画面'}</i></button>)}</div></section>;
}
