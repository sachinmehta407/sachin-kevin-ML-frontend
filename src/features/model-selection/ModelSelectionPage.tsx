import { ArrowRight, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StageBanner } from '../../components/layout/StageBanner';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/Page';
import { modelCandidates } from '../../data/modelCandidates';
import { useAppStore } from '../../store/useAppStore';

export function ModelSelectionPage(){
  const nav=useNavigate();const {selectedModels,toggleModel,completeStage}=useAppStore();
  const next=()=>{completeStage('model-selection','training');nav('/training');};
  return <div><StageBanner stage="model-selection" prerequisite="Complete the exploratory analysis first."/><PageHeader eyebrow="Modeling · Step 5" title="Select candidate models" description="AutoML recommends a diverse shortlist balancing accuracy, explainability and runtime."/><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{modelCandidates.map(m=>{const chosen=selectedModels.includes(m.name);return <Card key={m.id} className={m.excluded?'opacity-60':chosen?'ring-2 ring-violet':''}><div className="flex justify-between"><BrainCircuit className={chosen?'text-violet':'text-muted'}/><Badge tone={m.excluded?'coral':chosen?'violet':'neutral'}>{m.excluded?'excluded':chosen?'selected':m.family}</Badge></div><h2 className="mt-4 font-bold text-ink">{m.name}</h2><p className="mt-1 min-h-[40px] text-sm text-muted">{m.reason}</p><p className="mt-4 text-xs text-muted">Estimated runtime <b className="text-ink">{m.estimate}</b></p><Button className="mt-4 w-full" variant={chosen?'primary':'secondary'} disabled={m.excluded} onClick={()=>toggleModel(m.name)}>{chosen?'Included':'Include model'}</Button></Card>})}</div><div className="mt-5 flex items-center justify-between"><p className="text-sm text-muted">{selectedModels.length} candidates selected</p><Button disabled={!selectedModels.length} onClick={next}>Configure training<ArrowRight size={16}/></Button></div></div>;
}
