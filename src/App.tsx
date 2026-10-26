import { EditorLayout } from './components/layout/EditorLayout';
import { AIPanel } from './components/ai/AIPanel';

export default function App() { return <EditorLayout assistant={<AIPanel/>}/>; }
