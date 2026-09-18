import { CheckCircle2 } from 'lucide-react';
import { StageBanner } from '../../components/layout/StageBanner';
import { Button } from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/Page';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAppStore } from '../../store/useAppStore';

export function EnsemblePage(){
  const {ensembleWeights,setEnsembleWeight,completeStage,addToast}=useAppStore();const total=Object.values(ensembleWeights).reduce((a,b)=>a+b,0);const valid=total===100;
  const save=()=>{completeStage('ensemble','overrides');addToast({title:'Ensemble saved',message:'Weights total 100%.'});};
  return <div><StageBanner stage="ensemble" prerequisite="Complete and compare model experiments first."/><PageHeader eyebrow="Modeling · Step 10" title="Build the final ensemble" description="Blend complementary models. The allocation must total exactly 100% before it can be saved."/><div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]"><Card><CardTitle>Model allocation</CardTitle><div className="space-y-6">{Object.entries(ensembleWeights).map(([model,value])=><div key={model}><div className="mb-2 flex justify-between"><span className="text-sm font-bold text-ink">{model}</span><span className="font-mono text-sm text-violet">{value}%</span></div><input className="w-full accent-violet" type="range" min="0" max="100" value={value} onChange={e=>setEnsembleWeight(model,Number(e.target.value))}/></div>)}</div></Card><Card><CardTitle>Validation</CardTitle><div className={`rounded-xl p-5 text-center ${valid?'bg-teal-soft text-teal':'bg-coral-soft text-coral'}`}><p className="font-mono text-4xl font-extrabold">{total}%</p><p className="mt-1 text-sm font-semibold">{valid?'Valid allocation':`${Math.abs(100-total)} points ${total>100?'over':'remaining'}`}</p></div><div className="mt-5"><ProgressBar value={total}/></div><Button className="mt-5 w-full" disabled={!valid} onClick={save}><CheckCircle2 size={16}/>Save ensemble</Button></Card></div></div>;
}
