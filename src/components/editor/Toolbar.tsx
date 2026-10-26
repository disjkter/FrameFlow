import { Brush, Eraser, MousePointer2, Redo2, Scan, Undo2 } from 'lucide-react';
import { getActiveFrame, useEditorStore } from '../../stores/editorStore';
import type { Tool } from '../../types/editor';

const tools: { id: Tool; label: string; icon: typeof Brush }[] = [
  { id: 'select', label: '选择', icon: MousePointer2 }, { id: 'brush', label: '画笔', icon: Brush },
  { id: 'eraser', label: '橡皮擦', icon: Eraser }, { id: 'region', label: '区域选择', icon: Scan },
];

export function Toolbar() {
  const store = useEditorStore(); const frame = getActiveFrame(store);
  return <aside className="toolbar panel">
    <div className="panel-heading"><span className="eyebrow">创作工具</span><h2>画布编辑</h2></div>
    <div className="tool-grid">{tools.map(({ id, label, icon: Icon }) => <button key={id} className={`tool-button ${store.activeTool === id ? 'active' : ''}`} onClick={() => store.setTool(id)} title={label}><Icon size={18}/><span>{label}</span></button>)}</div>
    <div className="divider" />
    <label className="field"><span>画笔颜色</span><div className="color-row"><input aria-label="画笔颜色" type="color" value={store.brushColor} onChange={(e) => store.setBrushColor(e.target.value)} /><code>{store.brushColor}</code></div></label>
    <label className="field"><span>笔触粗细 <b>{store.brushSize}px</b></span><input type="range" min="2" max="36" value={store.brushSize} onChange={(e) => store.setBrushSize(Number(e.target.value))}/></label>
    <div className="divider" />
    <div className="history-row"><button className="secondary-button" disabled={!frame.history.length} onClick={store.undo}><Undo2 size={16}/>撤销</button><button className="secondary-button" disabled={!frame.future.length} onClick={store.redo}><Redo2 size={16}/>重做</button></div>
    <div className="tool-tip"><span>提示</span><p>{store.activeTool === 'region' ? '拖动鼠标框选 AI 需要关注的区域。' : store.activeTool === 'eraser' ? '橡皮擦只清除你的笔画，不会破坏基础场景。' : store.activeTool === 'brush' ? '在画布上按住并拖动，松开后生成一条独立笔画。' : '选择工具用于查看与定位问题。'}</p></div>
  </aside>;
}
