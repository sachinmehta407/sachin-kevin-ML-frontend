import { Bot, Loader2, Send, Sparkles, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { useAssistantContext } from '../../hooks/useAssistantContext';
import { assistantService } from '../../services/assistant';
import { useAppStore } from '../../store/useAppStore';

export function ForecastAssistant() {
  const { pathname } = useLocation();
  const context = useAssistantContext();
  const open = useAppStore((s) => s.assistantOpen);
  const setOpen = useAppStore((s) => s.setAssistantOpen);
  const messages = useAppStore((s) => s.assistantMessages);
  const append = useAppStore((s) => s.appendAssistantMessage);
  const clear = useAppStore((s) => s.clearAssistantMessages);

  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [briefKey, setBriefKey] = useState(pathname);
  const endRef = useRef<HTMLDivElement>(null);

  const brief = assistantService.brief(context);
  const prompts = assistantService.suggestPrompts(context);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, busy]);

  // When the user changes stage with the panel open, post a short briefing once.
  useEffect(() => {
    if (!open) {
      setBriefKey(pathname);
      return;
    }
    if (briefKey === pathname) return;
    setBriefKey(pathname);
    append({
      role: 'assistant',
      content: `Now on **${brief.title}**.\n\n${brief.summary}`,
      stageId: context.stageId,
    });
  }, [pathname, open, briefKey, brief.title, brief.summary, context.stageId, append]);

  const ask = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    setBusy(true);
    setDraft('');
    append({ role: 'user', content: question, stageId: context.stageId });
    try {
      const reply = await assistantService.ask(question, context);
      append({ role: 'assistant', content: reply.answer, stageId: context.stageId });
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(draft);
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="pointer-events-auto flex h-[min(560px,calc(100vh-7.5rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-lift animate-fade-up">
          <div className="flex items-center gap-3 bg-gradient-to-br from-violet via-[#4f43c4] to-blue p-4 text-white">
            <Sparkles size={20} />
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold">Forecast Assistant</p>
              <p className="truncate text-xs text-white/80">
                Context: {context.stageLabel} · {context.stageStatus}
              </p>
            </div>
            <button
              type="button"
              title="Clear conversation"
              onClick={() => clear()}
              className="rounded-lg p-1.5 hover:bg-white/15"
            >
              <Trash2 size={16} />
            </button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-white/15">
              <X size={18} />
            </button>
          </div>

          <div className="border-b border-border bg-canvas px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Stage briefing</p>
            <p className="mt-0.5 text-xs text-ink">{brief.summary}</p>
          </div>

          <div className="flex-1 space-y-3 overflow-auto p-3">
            {messages.length === 0 && (
              <div className="rounded-xl bg-violet-soft p-3 text-sm text-ink">
                Ask about transformations, model choice, WAPE, under-forecasting, template compare, or recommended
                quantities. Answers use this demo&apos;s workflow state — no LLM call yet.
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'ml-auto bg-violet text-white'
                    : 'border border-border bg-canvas text-ink'
                }`}
              >
                {m.content.replace(/\*\*/g, '')}
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-muted">
                <Loader2 size={14} className="animate-spin" /> Thinking from workflow context…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border px-3 py-2">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted">Suggested for this stage</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {prompts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  disabled={busy}
                  onClick={() => void ask(p.prompt)}
                  className="shrink-0 rounded-full border border-border bg-canvas px-2.5 py-1 text-[11px] font-semibold text-ink hover:border-violet disabled:opacity-50"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 border-t border-border p-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about this stage…"
              className="flex-1 rounded-xl border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-violet"
            />
            <button
              type="submit"
              disabled={busy || !draft.trim()}
              className="grid h-10 w-10 place-items-center rounded-xl bg-violet text-white disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="border-t border-border px-3 py-2 text-center text-[10px] text-muted">
            MockAssistantService · swap for LLM API later without UI redesign
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close forecast assistant' : 'Ask the forecast'}
        aria-expanded={open}
        title={open ? 'Close' : 'Ask the forecast'}
        className={`pointer-events-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-violet to-blue text-white shadow-glow transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet ${open ? '' : 'animate-soft-pulse'}`}
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>
    </div>
  );
}
