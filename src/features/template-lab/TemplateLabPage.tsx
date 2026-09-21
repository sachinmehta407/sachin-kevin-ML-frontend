import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Beaker, CheckCircle2, Play, Plus, Trash2 } from 'lucide-react';
import { jewelleryCategoryStats, scopeLabel } from '../../data/jewelleryCorpus';
import { StageBanner } from '../../components/layout/StageBanner';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { PageHeader, tableClass, tdClass, thClass } from '../../components/ui/Page';
import { useAppStore } from '../../store/useAppStore';
import type { JewelleryCategory, JewelleryCity, JewelleryRegion, TemplateScope } from '../../types/jewellery';

const CATEGORIES: JewelleryCategory[] = ['Bridal', 'Rings', 'Earrings', 'Necklaces'];
const REGIONS: JewelleryRegion[] = ['North', 'South', 'East', 'West'];
const CITIES: JewelleryCity[] = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad'];
const MODEL_OPTIONS = ['XGBoost', 'LightGBM', 'SARIMA', 'Prophet', 'TFT', 'Holt-Winters'];

const statusTone = {
  draft: 'neutral' as const,
  running: 'amber' as const,
  complete: 'blue' as const,
  approved: 'teal' as const,
};

export function TemplateLabPage() {
  const navigate = useNavigate();
  const {
    forecastTemplates,
    createForecastTemplate,
    runForecastTemplate,
    approveForecastTemplate,
    setTemplatePriority,
    deleteForecastTemplate,
    completeStage,
    addToast,
  } = useAppStore();

  const [name, setName] = useState('Template — new scoped experiment');
  const [description, setDescription] = useState('Scoped AutoML run for a jewellery slice.');
  const [categories, setCategories] = useState<JewelleryCategory[]>([]);
  const [regions, setRegions] = useState<JewelleryRegion[]>([]);
  const [cities, setCities] = useState<JewelleryCity[]>([]);
  const [skuText, setSkuText] = useState('');
  const [models, setModels] = useState<string[]>(['XGBoost', 'LightGBM']);
  const [priority, setPriority] = useState(25);

  const scope: TemplateScope = useMemo(
    () => ({
      ...(categories.length ? { categories } : {}),
      ...(regions.length ? { regions } : {}),
      ...(cities.length ? { cities } : {}),
      ...(skuText.trim()
        ? {
            skus: skuText
              .split(/[,\s]+/)
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : {}),
    }),
    [categories, regions, cities, skuText],
  );

  const toggle = <T extends string>(list: T[], value: T, set: (v: T[]) => void) => {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };

  const create = () => {
    createForecastTemplate({ name, description, scope, models, priority });
    addToast({ title: 'Template created', message: scopeLabel(scope) });
  };

  const continueNext = () => {
    completeStage('template-lab', 'forecast-assembly');
    addToast({ title: 'Template lab complete', message: 'Assemble the final forecast next.' });
    navigate('/forecast-assembly');
  };

  return (
    <div className="space-y-5">
      <StageBanner
        stage="template-lab"
        prerequisite="Complete overrides (or unlock this stage) before running scoped template experiments."
      />
      <PageHeader
        eyebrow="Decision · Template Lab"
        title="Jewellery template experiments"
        description="Template 1 covers all 1,000 SKUs. Create scoped templates (category, city, region, SKU) to improve weak slices without rebuilding everything."
        actions={
          <Button onClick={continueNext}>
            Continue to assembly
            <CheckCircle2 size={16} />
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {jewelleryCategoryStats.map((c) => (
          <Card key={c.category} className="!p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{c.category}</p>
            <p className="mt-1 font-mono text-2xl font-bold text-ink">{c.skus}</p>
            <p className="text-xs text-muted">
              Default accuracy <span className="font-semibold text-ink">{c.baselineAccuracy}%</span>
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
        <Card>
          <CardTitle subtitle="Leave filters empty for full population. Combine filters with AND logic.">
            Create scoped template
          </CardTitle>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-muted">
              Name
              <input className="input mt-1 w-full" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="block text-xs font-bold text-muted">
              Description
              <textarea
                className="input mt-1 min-h-16 w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <div>
              <p className="mb-1.5 text-xs font-bold text-muted">Category</p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`chip ${categories.includes(c) ? '!border-violet/40 !bg-violet-soft !text-violet' : ''}`}
                    onClick={() => toggle(categories, c, setCategories)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-bold text-muted">Region</p>
              <div className="flex flex-wrap gap-1.5">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`chip ${regions.includes(r) ? '!border-violet/40 !bg-violet-soft !text-violet' : ''}`}
                    onClick={() => toggle(regions, r, setRegions)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-bold text-muted">City</p>
              <div className="flex flex-wrap gap-1.5">
                {CITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`chip ${cities.includes(c) ? '!border-violet/40 !bg-violet-soft !text-violet' : ''}`}
                    onClick={() => toggle(cities, c, setCities)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-xs font-bold text-muted">
              Specific SKUs (comma-separated)
              <input
                className="input mt-1 w-full"
                placeholder="BR-001, BR-002, BR-003"
                value={skuText}
                onChange={(e) => setSkuText(e.target.value)}
              />
            </label>

            <div>
              <p className="mb-1.5 text-xs font-bold text-muted">Models</p>
              <div className="flex flex-wrap gap-1.5">
                {MODEL_OPTIONS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`chip ${models.includes(m) ? '!border-violet/40 !bg-violet-soft !text-violet' : ''}`}
                    onClick={() => toggle(models, m, setModels)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-xs font-bold text-muted">
              Priority (higher replaces lower on overlap)
              <input
                className="input mt-1 w-32"
                type="number"
                min={0}
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
              />
            </label>

            <p className="rounded-xl bg-canvas px-3 py-2 text-xs text-muted">
              Scope preview: <span className="font-semibold text-ink">{scopeLabel(scope)}</span>
            </p>

            <Button onClick={create} disabled={!name.trim() || models.length === 0}>
              <Plus size={16} /> Create template
            </Button>
          </div>
        </Card>

        <Card>
          <CardTitle subtitle="Baseline stays for strong segments. Approve scoped wins to use in assembly.">
            How it works
          </CardTitle>
          <ol className="space-y-3 text-sm text-ink">
            <li className="rounded-xl bg-canvas/80 p-3">
              <strong>1. Default AutoML</strong> — Template 1 predicts all 1,000 SKUs (baseline).
            </li>
            <li className="rounded-xl bg-canvas/80 p-3">
              <strong>2. Improve a slice</strong> — e.g. Bridal only (200 SKUs) with Template 2.
            </li>
            <li className="rounded-xl bg-canvas/80 p-3">
              <strong>3. Approve</strong> — mark the experiment as approved for final assembly.
            </li>
            <li className="rounded-xl bg-canvas/80 p-3">
              <strong>4. Assemble</strong> — Final = Template 1 everywhere except replaced slices.
            </li>
          </ol>
          <p className="mt-4 text-xs text-muted">
            Example: Bridal 78% → Template 2 Bridal 88%. Rings / Earrings / Necklaces keep Template 1.
          </p>
        </Card>
      </div>

      <Card>
        <CardTitle subtitle="Run scoped AutoML, then approve winners for assembly">Template registry</CardTitle>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Template</th>
                <th className={thClass}>Scope</th>
                <th className={thClass}>SKUs</th>
                <th className={thClass}>Accuracy</th>
                <th className={thClass}>Priority</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forecastTemplates.map((t) => (
                <tr key={t.id}>
                  <td className={`${tdClass} font-semibold`}>
                    {t.name}{' '}
                    {t.isBaseline && <Badge tone="violet">baseline</Badge>}                    <p className="mt-0.5 text-xs font-normal text-muted">{t.models.join(', ')}</p>
                  </td>
                  <td className={`${tdClass} max-w-xs text-xs`}>{scopeLabel(t.scope)}</td>
                  <td className={`${tdClass} font-mono`}>{t.skuCount.toLocaleString()}</td>
                  <td className={`${tdClass} font-mono`}>
                    {t.accuracy != null ? `${t.accuracy}%` : '—'}
                  </td>
                  <td className={tdClass}>
                    <input
                      className="input w-20"
                      type="number"
                      value={t.priority}
                      disabled={t.isBaseline}
                      onChange={(e) => setTemplatePriority(t.id, Number(e.target.value))}
                    />
                  </td>
                  <td className={tdClass}>
                    <Badge tone={statusTone[t.status]}>{t.status}</Badge>
                  </td>
                  <td className={tdClass}>
                    <div className="flex flex-wrap gap-1">
                      {t.status !== 'running' && t.status !== 'approved' && (
                        <Button
                          variant="secondary"
                          className="!px-2 !py-1 text-xs"
                          onClick={() => {
                            runForecastTemplate(t.id);
                            addToast({ title: 'AutoML running', message: `Scoped run for ${t.name}` });
                          }}
                        >
                          <Play size={13} /> Run
                        </Button>
                      )}
                      {(t.status === 'complete' || t.status === 'approved') && !t.isBaseline && (
                        <Button
                          variant="secondary"
                          className="!px-2 !py-1 text-xs"
                          onClick={() => {
                            approveForecastTemplate(t.id);
                            addToast({ title: 'Template approved', message: t.name });
                          }}
                        >
                          <Beaker size={13} /> Approve
                        </Button>
                      )}
                      {!t.isBaseline && (
                        <Button variant="ghost" className="!px-2 !py-1" onClick={() => deleteForecastTemplate(t.id)}>
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
