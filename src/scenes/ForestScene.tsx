import { Circle, Ellipse, Group, Line, Rect } from 'react-konva';
import type { SceneState } from '../types/editor';

interface Props { scene: SceneState; opacity?: number }

export function ForestScene({ scene, opacity = 1 }: Props) {
  const poses = {
    ready: { x: 360, y: 335, lean: -10, leftArm: [0, 25, -48, 52], rightArm: [0, 25, 48, 45], leftLeg: [0, 90, -38, 142], rightLeg: [0, 90, 42, 132] },
    running: { x: 465, y: 295, lean: 12, leftArm: [0, 27, -58, 5], rightArm: scene.armCorrected ? [0, 28, 58, 58] : [0, 28, 12, -42], leftLeg: [0, 92, -65, 128], rightLeg: [0, 92, 72, 112] },
    landing: { x: 610, y: 320, lean: 5, leftArm: [0, 28, -42, 68], rightArm: [0, 28, 54, 50], leftLeg: [0, 92, -55, 138], rightLeg: [0, 92, 58, 140] },
  };
  const p = poses[scene.pose];
  return <Group opacity={opacity}>
    <Rect width={960} height={540} fill="#102a2b" />
    <Rect y={365} width={960} height={175} fill="#1a3328" />
    <Circle x={170} y={105} radius={155} fill="#173b36" />
    <Circle x={760} y={92} radius={190} fill="#153731" />
    {[80, 210, 760, 875].map((x, i) => <Group key={x}>
      <Rect x={x} y={80 + i * 12} width={40 + i % 2 * 12} height={330} cornerRadius={18} fill={i % 2 ? '#34543f' : '#2b4a39'} />
      <Circle x={x + 22} y={80 + i * 8} radius={82} fill={i % 2 ? '#28543e' : '#236047'} />
    </Group>)}
    <Line points={[0, 405, 150, 390, 320, 415, 500, 395, 690, 410, 960, 390]} stroke="#77945b" strokeWidth={7} tension={0.35} />
    <Line points={[705, 405, 750, 374, 790, 404]} stroke="#5b402b" strokeWidth={18} lineCap="round" lineJoin="round" />
    <Group x={p.x} y={p.y} rotation={p.lean}>
      <Line points={[5, 28, -55, 50, -74, 100, 10, 84]} closed fill={scene.capeColor === 'red' ? '#d9485f' : '#3978cf'} stroke="#f1a0aa" strokeWidth={3} lineJoin="round" />
      <Line points={[0, 25, 0, 92]} stroke="#14202b" strokeWidth={34} lineCap="round" />
      <Line points={p.leftArm} stroke="#f1c7ae" strokeWidth={17} lineCap="round" lineJoin="round" />
      <Line points={p.rightArm} stroke={scene.armCorrected ? '#f1c7ae' : '#f0a49e'} strokeWidth={17} lineCap="round" lineJoin="round" />
      <Line points={p.leftLeg} stroke="#293d59" strokeWidth={21} lineCap="round" lineJoin="round" />
      <Line points={p.rightLeg} stroke="#293d59" strokeWidth={21} lineCap="round" lineJoin="round" />
      <Ellipse x={5} y={-5} radiusX={34} radiusY={38} fill="#f3cbb3" stroke="#1f2937" strokeWidth={3} />
      <Line points={[-27, -14, -8, -42, 28, -23]} stroke="#3a2725" strokeWidth={17} lineCap="round" lineJoin="round" />
      <Circle x={18} y={-8} radius={3} fill="#1f2937" />
    </Group>
    <Rect width={960} height={540} stroke="#35535a" strokeWidth={4} />
  </Group>;
}
