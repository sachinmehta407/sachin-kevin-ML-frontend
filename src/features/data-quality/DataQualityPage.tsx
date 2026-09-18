import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StageBanner } from '../../components/layout/StageBanner';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/Page';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAppStore } from '../../store/useAppStore';
import type { IssueDecision } from '../../types/app';

export function DataQualityPage() {
  const navigate=useNavigate(); const {qualityIssues,decisions,decideIssue,completeStage}=useAppStore();
  const decided=qualityIssues.filter(i=>decisions[i.id]!=='pending').length;
  const proceed=()=>{completeStage('quality','standardization');navigate('/standardization');};
  return <div><StageBanner stage="quality" prerequisite="Confirm ingestion and column mappings first."/><PageHeader eyebrow="Data · Step 2" title="Resolve quality findings" description="Make an explicit decision for each issue. Decisions are retained in the demo audit trail."/><Card className="mb-5"><ProgressBar value={decided/qualityIssues.length*100} label={`${decided} of ${qualityIssues.length} decisions recorded`}/></Card><div className="grid gap-4 lg:grid-cols-2">{qualityIssues.map(i=><Card key={i.id}><div className="flex items-start justify-between gap-3"><div><Badge tone={i.severity==='critical'||i.severity==='high'?'coral':i.severity==='medium'?'amber':'blue'}>{i.severity}</Badge><h2 className="mt-2 font-bold text-ink">{i.title}</h2><p className="mt-1 text-sm text-muted">{i.description}</p></div><span className="font-mono text-sm font-bold text-ink">{i.affectedRows.toLocaleString()}</span></div><div className="mt-4 rounded-lg bg-canvas p-3 text-xs"><p><b>Evidence:</b> {i.evidence}</p><p className="mt-1"><b>Suggested:</b> {i.suggested}</p></div><div className="mt-4 flex gap-2">{(['accept','modify','reject'] as IssueDecision[]).map(d=><Button key={d} variant={decisions[i.id]===d?'primary':'secondary'} className="flex-1 capitalize" onClick={()=>decideIssue(i.id,d)}>{d}</Button>)}</div></Card>)}</div><div className="mt-5 flex justify-end"><Button disabled={decided<qualityIssues.length} onClick={proceed}><ShieldCheck size={16}/>Apply decisions<ArrowRight size={16}/></Button></div></div>;
}
