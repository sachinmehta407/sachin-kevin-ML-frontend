import { ArrowRight, WandSparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StageBanner } from '../../components/layout/StageBanner';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { PageHeader, tableClass, tdClass, thClass } from '../../components/ui/Page';
import { transformations as seed } from '../../data/transformations';
import { useAppStore } from '../../store/useAppStore';

export function StandardizationPage(){
  const nav=useNavigate(); const {transformations,setTransformations,approvePrepared}=useAppStore(); const rows=transformations.length?transformations:seed;
  const apply=()=>setTransformations(rows.map(r=>({...r,status:'applied'})));
  const next=()=>{setTransformations(rows.map(r=>({...r,status:'applied'})));approvePrepared();nav('/forecast-eda');};
  return <div><StageBanner stage="standardization" prerequisite="Resolve all data-quality decisions first."/><PageHeader eyebrow="Data · Step 3" title="Standardize the training set" description="Review deterministic cleanup steps before creating the prepared dataset." actions={<Button variant="secondary" onClick={apply}><WandSparkles size={16}/>Apply all</Button>}/><Card><CardTitle subtitle="Every mutation is represented as an auditable rule">Transformation audit</CardTitle><div className="overflow-x-auto"><table className={tableClass}><thead><tr><th className={thClass}>Transformation</th><th className={thClass}>Field</th><th className={thClass}>Rule</th><th className={thClass}>Rows</th><th className={thClass}>Status</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td className={tdClass+" font-semibold"}>{r.name}</td><td className={tdClass}>{r.field}</td><td className={tdClass}>{r.rule}</td><td className={tdClass+" font-mono"}>{r.affectedRows.toLocaleString()}</td><td className={tdClass}><Badge tone={r.status==='applied'?'teal':'amber'}>{r.status}</Badge></td></tr>)}</tbody></table></div></Card><div className="mt-5 flex justify-end"><Button onClick={next}>Approve prepared data<ArrowRight size={16}/></Button></div></div>;
}
