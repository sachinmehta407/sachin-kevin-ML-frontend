import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StageBanner } from '../../components/layout/StageBanner';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/Page';
import { useAppStore } from '../../store/useAppStore';

export function ApprovalPage(){
  const nav=useNavigate();const [notes,setNotes]=useState('Approved for FY26 planning and weekly replenishment.');const {approvalStatus,setApprovalStatus,approveForecast,addToast}=useAppStore();
  const approve=()=>{approveForecast(notes);addToast({title:'Forecast approved',message:'A new immutable version was created.'});nav('/versions');};
  return <div><StageBanner stage="approval" prerequisite="Run the template delta comparison before approval."/><PageHeader eyebrow="Decision · Step 13" title="Approve the forecast" description="Review the release checklist, record an approval note and create a versioned forecast." actions={<Badge tone={approvalStatus==='approved'?'teal':'amber'}>{approvalStatus}</Badge>}/><div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]"><Card><CardTitle>Release checklist</CardTitle><div className="space-y-3">{['Data quality decisions recorded','Prepared dataset approved','Rolling validation completed','Segment bias reviewed','Ensemble weights total 100%','Template delta calculated'].map(x=><div key={x} className="flex gap-3 rounded-lg bg-teal-soft p-3 text-sm font-semibold text-ink"><CheckCircle2 className="text-teal" size={18}/>{x}</div>)}</div></Card><Card><CardTitle>Approval decision</CardTitle><label className="text-xs font-bold text-muted">Release note</label><textarea className="input mt-2 min-h-32 w-full" value={notes} onChange={e=>setNotes(e.target.value)}/><div className="mt-4 grid grid-cols-2 gap-2"><Button variant="secondary" onClick={()=>setApprovalStatus('rejected')}>Return for changes</Button><Button onClick={approve}><ShieldCheck size={16}/>Approve & version</Button></div></Card></div></div>;
}
