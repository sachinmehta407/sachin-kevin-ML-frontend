import { ArrowRight, CheckCircle2, FileSpreadsheet, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { PageHeader, tableClass, tdClass, thClass } from '../../components/ui/Page';

export function IngestionPage() {
  const navigate = useNavigate();
  const { files, demoLoaded, loadDemo, columnMappings, setColumnMapping, completeStage, addToast } = useAppStore();
  const proceed = () => { completeStage('ingestion','quality'); addToast({title:'Mappings confirmed'}); navigate('/data-quality'); };
  return <div><PageHeader eyebrow="Data · Step 1" title="Ingest sales history" description="Validate source files and map the source schema to forecasting roles." actions={<Button variant="secondary" onClick={loadDemo}><UploadCloud size={16}/>{demoLoaded?'Reload demo':'Load demo files'}</Button>}/>
    <div className="grid gap-5 xl:grid-cols-2"><Card><CardTitle subtitle="Local mock files; nothing is uploaded">Source files</CardTitle><div className="space-y-3">{files.map((f)=><div key={f.id} className="flex items-center gap-3 rounded-xl border border-border p-3"><FileSpreadsheet className="text-teal"/><div className="flex-1"><p className="text-sm font-bold text-ink">{f.name}</p><p className="text-xs text-muted">{f.period} · {f.rows.toLocaleString()} rows · {f.size}</p></div><Badge tone={f.status==='validated'?'teal':'amber'}>{f.status}</Badge></div>)}</div></Card>
    <Card><CardTitle subtitle="Auto-detected with editable forecasting roles">Column mapping</CardTitle><div className="overflow-x-auto"><table className={tableClass}><thead><tr><th className={thClass}>Source</th><th className={thClass}>Role</th><th className={thClass}>Confidence</th></tr></thead><tbody>{columnMappings.map((m)=><tr key={m.source}><td className={tdClass}>{m.source}</td><td className={tdClass}><select className="input" value={m.target} onChange={(e)=>setColumnMapping(m.source,e.target.value as typeof m.target)}>{['date','sales','sku','product','category','region','ignore'].map(x=><option key={x}>{x}</option>)}</select></td><td className={tdClass}><span className="font-mono text-teal">{m.confidence}%</span></td></tr>)}</tbody></table></div></Card></div>
    <div className="mt-5 flex justify-end"><Button disabled={!demoLoaded} onClick={proceed}><CheckCircle2 size={16}/>Confirm & validate<ArrowRight size={16}/></Button></div>
  </div>;
}
