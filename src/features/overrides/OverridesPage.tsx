import { Plus, Trash2 } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { PageHeader, tableClass, tdClass, thClass } from '../../components/ui/Page';
import { StageBanner } from '../../components/layout/StageBanner';
import { useAppStore } from '../../store/useAppStore';

export function OverridesPage(){
  const {overrides,addOverride,updateOverride,deleteOverride}=useAppStore();
  const add=()=>addOverride({id:crypto.randomUUID(),sku:'SKU-1042',region:'West',period:'Oct 2026',baseline:1240,override:1360,reason:'Planned promotion'});
  return <div><StageBanner stage="overrides" prerequisite="Save a valid ensemble before applying business judgment."/><PageHeader eyebrow="Decision · Step 11" title="Apply business overrides" description="Document human adjustments while preserving the model baseline and delta." actions={<Button onClick={add}><Plus size={16}/>Add sample override</Button>}/><Card><CardTitle subtitle="All changes remain editable and traceable">Override register</CardTitle>{overrides.length===0?<EmptyState title="No overrides applied" description="The model forecast is unchanged. Add a documented adjustment when external knowledge is material." action={<Button onClick={add}>Add override</Button>}/>:<div className="overflow-x-auto"><table className={tableClass}><thead><tr><th className={thClass}>SKU / region</th><th className={thClass}>Period</th><th className={thClass}>Baseline</th><th className={thClass}>Override</th><th className={thClass}>Delta</th><th className={thClass}>Reason</th><th className={thClass}></th></tr></thead><tbody>{overrides.map(r=><tr key={r.id}><td className={tdClass+" font-semibold"}>{r.sku}<p className="text-xs font-normal text-muted">{r.region}</p></td><td className={tdClass}>{r.period}</td><td className={tdClass}>{r.baseline}</td><td className={tdClass}><input className="input w-24" type="number" value={r.override} onChange={e=>updateOverride(r.id,{override:Number(e.target.value)})}/></td><td className={tdClass+" font-mono text-violet"}>{r.override-r.baseline>0?'+':''}{r.override-r.baseline}</td><td className={tdClass}><input className="input min-w-40" value={r.reason} onChange={e=>updateOverride(r.id,{reason:e.target.value})}/></td><td className={tdClass}><Button variant="ghost" onClick={()=>deleteOverride(r.id)}><Trash2 size={15}/></Button></td></tr>)}</tbody></table></div>}</Card></div>;
}
