import { FileSearch, Play } from 'lucide-react';
import { useRef, useState } from 'react';
import { StageBanner } from '../../components/layout/StageBanner';
import { Button } from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/Page';
import { templates } from '../../data/templates';
import { useAppStore } from '../../store/useAppStore';

const runLines=['Loading shared comparison segments…','Matching template dimensions…','Computing missing forecast cells…','Scoring candidate and production residuals…','Delta complete: 482 cells added, WAPE improved 1.7 pts.'];
export function TemplateComparePage(){
  const {templateA,templateB,setTemplates,compareLog,setCompareLog,completeStage}=useAppStore();const [running,setRunning]=useState(false);const timers=useRef<number[]>([]);
  const run=()=>{timers.current.forEach(clearTimeout);setCompareLog([]);setRunning(true);runLines.forEach((_,i)=>timers.current.push(window.setTimeout(()=>{setCompareLog(runLines.slice(0,i+1));if(i===runLines.length-1){setRunning(false);completeStage('template-compare','approval');}},550*(i+1))));};
  const a=templates.find(t=>t.id===templateA)!;const b=templates.find(t=>t.id===templateB)!;
  return <div><StageBanner stage="template-compare" prerequisite="Complete forecast review and overrides first."/><PageHeader eyebrow="Decision · Step 12" title="Compare forecast templates" description="Quantify coverage and accuracy differences against the current production template." actions={<Button disabled={running||templateA===templateB} onClick={run}><Play size={16}/>Run Missing Delta</Button>}/><div className="grid gap-5 lg:grid-cols-2">{[['Template A',templateA,a],['Template B',templateB,b]].map(([label,id,t])=><Card key={String(label)}><label className="text-xs font-bold uppercase text-muted">{String(label)}</label><select className="input my-3 w-full" value={String(id)} onChange={e=>label==='Template A'?setTemplates(e.target.value,templateB):setTemplates(templateA,e.target.value)}>{templates.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select><h2 className="font-bold text-ink">{(t as typeof a).description}</h2><div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="rounded-lg bg-canvas p-3"><b>{(t as typeof a).wape}%</b><p className="text-xs text-muted">WAPE</p></div><div className="rounded-lg bg-canvas p-3"><b>{(t as typeof a).bias}%</b><p className="text-xs text-muted">Bias</p></div><div className="rounded-lg bg-canvas p-3"><b>{(t as typeof a).coverage}%</b><p className="text-xs text-muted">Coverage</p></div></div></Card>)}</div><Card className="mt-5"><CardTitle>Missing delta log</CardTitle><div className="min-h-40 rounded-xl bg-ink p-4 font-mono text-xs text-teal-soft">{compareLog.length?<>{compareLog.map((l,i)=><p className="mb-2" key={l}>[{i+1}] {l}</p>)}</>:<div className="grid place-items-center py-10 text-white/40"><FileSearch className="mb-2"/>Run comparison to generate a delta report.</div>}</div></Card></div>;
}
