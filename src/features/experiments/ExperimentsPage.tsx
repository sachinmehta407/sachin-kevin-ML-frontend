import { Copy, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { StageBanner } from '../../components/layout/StageBanner';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { PageHeader, tableClass, tdClass, thClass } from '../../components/ui/Page';
import { useAppStore } from '../../store/useAppStore';

export function ExperimentsPage(){
  const [open,setOpen]=useState(false);const [name,setName]=useState('New experiment');const {experiments,createExperiment,duplicateExperiment,deleteExperiment}=useAppStore();
  const create=()=>{if(name.trim())createExperiment(name.trim());setOpen(false);};
  return <div><StageBanner stage="experiments" prerequisite="Complete a baseline training run first."/><PageHeader eyebrow="Modeling · Step 9" title="Compare experiments" description="Track alternative feature, horizon and candidate configurations without losing the baseline." actions={<Button onClick={()=>setOpen(true)}><Plus size={16}/>New experiment</Button>}/><Card><CardTitle subtitle="Lower WAPE and near-zero bias are preferred">Experiment registry</CardTitle><div className="overflow-x-auto"><table className={tableClass}><thead><tr><th className={thClass}>Name</th><th className={thClass}>Models</th><th className={thClass}>Horizon</th><th className={thClass}>WAPE</th><th className={thClass}>Bias</th><th className={thClass}>Status</th><th className={thClass}></th></tr></thead><tbody>{experiments.map(e=><tr key={e.id}><td className={tdClass+" font-semibold"}>{e.name}<p className="text-xs font-normal text-muted">{e.createdAt}</p></td><td className={tdClass}>{e.models.join(', ')}</td><td className={tdClass}>{e.horizon} wk</td><td className={tdClass+" font-mono"}>{e.wape?`${e.wape}%`:'—'}</td><td className={tdClass+" font-mono"}>{e.bias?`${e.bias}%`:'—'}</td><td className={tdClass}><Badge tone={e.status==='complete'?'teal':'amber'}>{e.status}</Badge></td><td className={tdClass}><div className="flex"><Button variant="ghost" onClick={()=>duplicateExperiment(e.id)}><Copy size={15}/></Button><Button variant="ghost" disabled={e.id==='default'} onClick={()=>deleteExperiment(e.id)}><Trash2 size={15}/></Button></div></td></tr>)}</tbody></table></div></Card><Modal open={open} title="Create experiment" onClose={()=>setOpen(false)}><label className="text-xs font-bold text-muted">Experiment name</label><input className="input mt-2 w-full" value={name} onChange={e=>setName(e.target.value)}/><div className="mt-5 flex justify-end gap-2"><Button variant="secondary" onClick={()=>setOpen(false)}>Cancel</Button><Button onClick={create}>Create</Button></div></Modal></div>;
}
