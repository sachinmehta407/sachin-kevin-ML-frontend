import { ArrowRight, Play, TerminalSquare } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StageBanner } from '../../components/layout/StageBanner';
import { Button } from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/Page';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAppStore } from '../../store/useAppStore';

const lines=['Preparing 351,010 validated observations…','Creating rolling-origin validation folds…','Fitting Seasonal Naive baseline — WAPE 15.3%','Fitting Holt-Winters — WAPE 12.8%','Fitting SARIMA — WAPE 11.7%','Tuning XGBoost hyperparameters — WAPE 10.9%','Calculating segment diagnostics and intervals…','Training completed successfully.'];
export function TrainingPage(){
  const nav=useNavigate();const timers=useRef<number[]>([]);const {trainingStatus,trainingLogs,trainingComplete,startTraining,addTrainingLog,finishTraining,selectedModels}=useAppStore();
  useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
  const run=()=>{timers.current.forEach(clearTimeout);startTraining();lines.forEach((line,i)=>timers.current.push(window.setTimeout(()=>{addTrainingLog(line);if(i===lines.length-1)finishTraining();},700*(i+1))));};
  return <div><StageBanner stage="training" prerequisite="Choose at least one model candidate first."/><PageHeader eyebrow="Modeling · Step 6" title="Train candidate models" description="Run a simulated rolling-origin evaluation and watch each candidate complete." actions={<Button disabled={trainingStatus==='running'} onClick={run}><Play size={16}/>{trainingComplete?'Run again':'Start training'}</Button>}/><div className="grid gap-5 xl:grid-cols-[1fr_1.4fr]"><Card><CardTitle>Run configuration</CardTitle><dl className="space-y-3 text-sm"><div><dt className="text-muted">Candidates</dt><dd className="font-semibold text-ink">{selectedModels.join(', ')}</dd></div><div><dt className="text-muted">Validation</dt><dd className="font-semibold text-ink">6 rolling folds · 12-week horizon</dd></div><div><dt className="text-muted">Objective</dt><dd className="font-semibold text-ink">Weighted absolute percentage error</dd></div></dl><div className="mt-6"><ProgressBar value={trainingComplete?100:trainingStatus==='running'?Math.min(92,trainingLogs.length/lines.length*100):0} label={trainingStatus}/></div></Card><Card><CardTitle>Training log</CardTitle><div className="h-72 overflow-auto rounded-xl bg-ink p-4 font-mono text-xs text-teal-soft">{trainingLogs.length===0?<span className="text-white/40">$ Ready to train</span>:trainingLogs.map((l,i)=><p key={`${l}-${i}`} className="mb-2"><span className="text-violet-soft">[{String(i+1).padStart(2,'0')}]</span> {l}</p>)}</div></Card></div>{trainingComplete&&<div className="mt-5 flex justify-end"><Button onClick={()=>nav('/dashboard')}><TerminalSquare size={16}/>Open results<ArrowRight size={16}/></Button></div>}</div>;
}
