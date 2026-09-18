import { Eye, LockKeyhole } from 'lucide-react';
import type { AppStageId } from '../../types/app';
import { useAppStore } from '../../store/useAppStore';

export function StageBanner({ stage, prerequisite }: { stage: AppStageId; prerequisite?: string }) {
  const status = useAppStore((s) => s.stageStatus[stage]);
  if (status !== 'locked') return null;
  return (
    <div className="mb-5 flex gap-3 rounded-2xl border border-amber/20 bg-amber-soft/90 p-4 text-sm text-amber shadow-soft">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/60 text-amber">
        <LockKeyhole size={18} />
      </div>
      <div>
        <p className="font-display font-bold">Preview mode</p>
        <p className="mt-0.5 opacity-90">
          {prerequisite ?? 'Complete the prior workflow stage to unlock actions.'} You can still
          explore this page.
        </p>
      </div>
      <Eye className="ml-auto shrink-0 opacity-70" size={18} />
    </div>
  );
}
