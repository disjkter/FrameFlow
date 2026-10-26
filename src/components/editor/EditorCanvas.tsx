import { useEffect, useRef, useState } from 'react';
import { Layer, Line, Rect, Stage } from 'react-konva';
import type Konva from 'konva';
import { ForestScene } from '../../scenes/ForestScene';
import { getActiveFrame, useEditorStore } from '../../stores/editorStore';
import { CANVAS_HEIGHT, CANVAS_WIDTH, type Point, type Region, type Stroke } from '../../types/editor';
import { registerCanvasStage } from '../../utils/canvas';

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function EditorCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [size, setSize] = useState({ width: 960, height: 540 });
  const [draft, setDraft] = useState<Stroke | null>(null);
  const [regionStart, setRegionStart] = useState<Point | null>(null);
  const store = useEditorStore();
  const frame = getActiveFrame(store);
  const scale = size.width / CANVAS_WIDTH;

  useEffect(() => {
    const element = containerRef.current; if (!element) return;
    const update = () => { const width = Math.min(CANVAS_WIDTH, element.clientWidth); setSize({ width, height: width * 9 / 16 }); };
    update(); const observer = new ResizeObserver(update); observer.observe(element); return () => observer.disconnect();
  }, []);
  useEffect(() => { registerCanvasStage(stageRef.current); return () => registerCanvasStage(null); }, []);

  const point = () => {
    const pos = stageRef.current?.getPointerPosition();
    return pos ? { x: pos.x / scale, y: pos.y / scale } : null;
  };
  const down = () => {
    const p = point(); if (!p) return;
    if (store.activeTool === 'brush' || store.activeTool === 'eraser') {
      setDraft({ id: makeId(), points: [p.x, p.y], color: store.brushColor, width: store.brushSize, composite: store.activeTool === 'eraser' ? 'destination-out' : 'source-over' });
    } else if (store.activeTool === 'region') { setRegionStart(p); store.setSelectedRegion({ x: p.x / CANVAS_WIDTH, y: p.y / CANVAS_HEIGHT, width: 0, height: 0 }); }
  };
  const move = () => {
    const p = point(); if (!p) return;
    if (draft) setDraft({ ...draft, points: [...draft.points, p.x, p.y] });
    if (regionStart) store.setSelectedRegion({
      x: Math.min(regionStart.x, p.x) / CANVAS_WIDTH, y: Math.min(regionStart.y, p.y) / CANVAS_HEIGHT,
      width: Math.abs(p.x - regionStart.x) / CANVAS_WIDTH, height: Math.abs(p.y - regionStart.y) / CANVAS_HEIGHT,
    });
  };
  const up = () => {
    if (draft && draft.points.length >= 4) store.addStroke(draft);
    setDraft(null); setRegionStart(null);
  };
  const renderStroke = (stroke: Stroke) => <Line key={stroke.id} points={stroke.points} stroke={stroke.color} strokeWidth={stroke.width} lineCap="round" lineJoin="round" tension={0.25} globalCompositeOperation={stroke.composite} />;
  const r: Region | null = store.selectedRegion;

  return <div className="canvas-shell" ref={containerRef}>
    <Stage ref={stageRef} width={size.width} height={size.height} scaleX={scale} scaleY={scale} onMouseDown={down} onMousemove={move} onMouseup={up} onMouseleave={up}>
      <Layer><ForestScene scene={frame.scene} /></Layer>
      <Layer>{frame.strokes.map(renderStroke)}{draft && renderStroke(draft)}</Layer>
      <Layer listening={false}>
        {r && <Rect x={r.x * CANVAS_WIDTH} y={r.y * CANVAS_HEIGHT} width={r.width * CANVAS_WIDTH} height={r.height * CANVAS_HEIGHT} fill="rgba(117,93,255,.14)" stroke="#9b87ff" strokeWidth={3} dash={[10, 7]} />}
      </Layer>
    </Stage>
    <div className="canvas-status"><span>画布 {CANVAS_WIDTH} × {CANVAS_HEIGHT}</span><span>修订版本 r{frame.revision}</span></div>
  </div>;
}
