import type Konva from 'konva';
let currentStage: Konva.Stage | null = null;
export const registerCanvasStage = (stage: Konva.Stage | null) => { currentStage = stage; };
export const captureCanvas = () => { if (!currentStage) return ''; const overlay = currentStage.getLayers()[2]; overlay?.hide(); const data = currentStage.toDataURL({ pixelRatio: 1 }); overlay?.show(); return data; };
export const exportCanvasPng = (filename: string) => { if (!currentStage) return false; const link = document.createElement('a'); link.download = filename; link.href = captureCanvas(); link.click(); return true; };
