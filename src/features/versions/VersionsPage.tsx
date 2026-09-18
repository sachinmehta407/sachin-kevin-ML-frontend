import { Download, GitCompareArrows } from 'lucide-react';
import { StageBanner } from '../../components/layout/StageBanner';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { PageHeader, tableClass, tdClass, thClass } from '../../components/ui/Page';
import { useAppStore } from '../../store/useAppStore';

export function VersionsPage(){
  const {versions,addToast}=useAppStore();
  return <div><StageBanner stage="versions" prerequisite="Approve a forecast to create its first release version."/><PageHeader eyebrow="Decision · Archive" title="Forecast versions" description="Browse approved and archived snapshots. Version records in this demo are stored locally."/><Card><CardTitle subtitle="Newest versions appear first">Version history</CardTitle><div className="overflow-x-auto"><table className={tableClass}><thead><tr><th className={thClass}>Version</th><th className={thClass}>Status</th><th className={thClass}>Created</th><th className={thClass}>Owner</th><th className={thClass}>WAPE</th><th className={thClass}>Notes</th><th className={thClass}></th></tr></thead><tbody>{versions.map(v=><tr key={v.id}><td className={tdClass+" font-bold"}>{v.name}</td><td className={tdClass}><Badge tone={v.status==='approved'?'teal':v.status==='draft'?'amber':'neutral'}>{v.status}</Badge></td><td className={tdClass}>{v.createdAt}</td><td className={tdClass}>{v.owner}</td><td className={tdClass+" font-mono"}>{v.wape}%</td><td className={tdClass}>{v.notes}</td><td className={tdClass}><div className="flex"><Button title="Compare" variant="ghost" onClick={()=>addToast({title:`Comparing ${v.name}`,message:'Comparison opened in demo mode.'})}><GitCompareArrows size={15}/></Button><Button title="Export" variant="ghost" onClick={()=>addToast({title:`${v.name} export prepared`,message:'No file is generated in this static demo.'})}><Download size={15}/></Button></div></td></tr>)}</tbody></table></div></Card></div>;
}
