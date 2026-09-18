import { MessageSquareText, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { assistantService } from '../../services/assistant';
import { useAppStore } from '../../store/useAppStore';
import { useAssistantContext } from '../../hooks/useAssistantContext';

/** Compact stage-aware coaching strip shown on every page. */
export function StageCoach() {
  const context = useAssistantContext();
  const setOpen = useAppStore((s) => s.setAssistantOpen);
  const append = useAppStore((s) => s.appendAssistantMessage);
  const clear = useAppStore((s) => s.clearAssistantMessages);

  const brief = useMemo(() => assistantService.brief(context), [context]);

  const ask = async (prompt: string) => {
    setOpen(true);
    append({ role: 'user', content: prompt, stageId: context.stageId });
    const reply = await assistantService.ask(prompt, context);
    append({ role: 'assistant', content: reply.answer, stageId: context.stageId });
  };

  return (
    <div className="panel mb-5 overflow-hidden animate-fade-up">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet to-blue text-white shadow-glow">
          <Sparkles size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-sm font-bold text-ink">
              Assistant · {brief.title}
            </p>
            <span className="rounded-md bg-canvas px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
              {context.stageStatus}
            </span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted">{brief.summary}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {brief.prompts.slice(0, 2).map((p) => (
            <button key={p.id} type="button" onClick={() => void ask(p.prompt)} className="chip">
              {p.label}
            </button>
          ))}
          <button
            type="button"
            className="chip !border-violet/20 !bg-violet-soft !text-violet"
            onClick={() => {
              clear();
              setOpen(true);
            }}
          >
            <MessageSquareText size={13} />
            Chat
          </button>
        </div>
      </div>
      {context.insights.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border/60 bg-canvas/40 px-4 py-2 md:px-5">
          {context.insights.slice(0, 3).map((line) => (
            <p key={line} className="flex items-center gap-1.5 text-[11px] text-muted">
              <span className="status-dot bg-violet" />
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
