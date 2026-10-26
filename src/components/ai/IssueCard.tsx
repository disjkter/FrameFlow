import { LocateFixed, Sparkles, X } from 'lucide-react';
import type { EvaluationIssue } from '../../services/ai/types';
const labels = { pose: '姿态', composition: '构图', style: '风格', consistency: '一致性' };
const severities = { low: '低', medium: '中', high: '高' };
export function IssueCard({ issue, active, onLocate, onCorrect, onIgnore }: { issue: EvaluationIssue; active: boolean; onLocate(): void; onCorrect(): void; onIgnore(): void }) {
  return <article className={`issue-card ${active ? 'active' : ''}`}><div className="issue-head"><div><span className={`severity ${issue.severity}`}>{severities[issue.severity]}风险</span><span className="category">{labels[issue.category]}</span></div><button className="icon-button" onClick={onIgnore} title="忽略问题"><X size={14}/></button></div><h3>{issue.title}</h3><p>{issue.description}</p><div className="suggestion"><strong>修改建议</strong>{issue.suggestion}</div><div className="issue-actions"><button onClick={onLocate}><LocateFixed size={14}/>定位</button><button className="correct" onClick={onCorrect}><Sparkles size={14}/>AI 修正</button></div></article>;
}
