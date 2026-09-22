import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers3, Sparkles } from 'lucide-react';
import { jewelleryCategoryStats } from '../../data/jewelleryCorpus';
import { StageBanner } from '../../components/layout/StageBanner';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { PageHeader, tableClass, tdClass, thClass } from '../../components/ui/Page';
import { useAppStore } from '../../store/useAppStore';

export function ForecastAssemblyPage() {
  const navigate = useNavigate();
  const { forecastTemplates, finalAssembly, assembleForecast, addToast } = useAppStore();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const approved = forecastTemplates.filter((t) => t.status === 'approved');
  const baseline = approved.find((t) => t.isBaseline);
  const overlays = approved.filter((t) => !t.isBaseline);

  const previewRows = useMemo(() => {
    if (!finalAssembly) return [];
    const rows = finalAssembly.predictions;
    const filtered =
      categoryFilter === 'All' ? rows : rows.filter((r) => r.category === categoryFilter);
    return filtered.slice(0, 25);
  }, [finalAssembly, categoryFilter]);

  const runAssemble = () => {
    if (!baseline) {
      addToast({ title: 'Baseline required', message: 'Approve Template 1 (Default AutoML) first.' });
      return;
    }
    assembleForecast();
    addToast({
      title: 'Final forecast assembled',
      message: 'Baseline kept; approved scopes replaced. Exactly one prediction per SKU.',
    });
  };

  return (
    <div className="space-y-5">
      <StageBanner
        stage="forecast-assembly"
        prerequisite="Create and approve templates in Template Lab before assembling the final forecast."
      />
      <PageHeader
        eyebrow="Decision · Final assembly"
        title="Assemble final Olist forecast"
        description="Final Forecast = Template 1 for everything EXCEPT slices replaced by approved experiments. No duplicate SKUs — replacements only."
        actions={
          <Button onClick={runAssemble}>
            <Sparkles size={16} /> Assemble final forecast
          </Button>
        }
      />

      <Card className="mesh-card">
        <div className="relative space-y-2 text-sm text-ink">
          <p className="font-display text-base font-bold">Conceptual formula</p>
          <p className="rounded-xl bg-canvas/80 px-4 py-3 font-mono text-xs md:text-sm">
            Final = Template 1 (all SKUs) − replaced slices + approved Template overlays
          </p>
          <p className="text-muted">
            Example: Health Beauty from Template 2 (88%), other Olist categories from Template 1. Still
            exactly <strong className="text-ink">one prediction per SKU</strong>.
          </p>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardTitle>Baseline</CardTitle>
          {baseline ? (
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-ink">{baseline.name}</p>
              <p className="text-muted">{baseline.skuCount.toLocaleString()} SKUs</p>
              <Badge tone="teal">approved · {baseline.accuracy}%</Badge>
            </div>
          ) : (
            <p className="text-sm text-muted">No approved baseline template.</p>
          )}
        </Card>
        <Card>
          <CardTitle>Approved overlays</CardTitle>
          {overlays.length === 0 ? (
            <p className="text-sm text-muted">None yet — Health Beauty Template 2 is pre-approved in the demo.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {overlays.map((t) => (
                <li key={t.id} className="rounded-lg bg-canvas px-3 py-2">
                  <p className="font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-muted">
                    {t.skuCount} SKUs · priority {t.priority} · {t.accuracy}%
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardTitle>Category baseline (Template 1)</CardTitle>
          <ul className="space-y-2 text-sm">
            {jewelleryCategoryStats.map((c) => (
              <li key={c.category} className="flex justify-between gap-2">
                <span>{c.category}</span>
                <span className="font-mono text-muted">
                  {c.skus} · {c.baselineAccuracy}%
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {finalAssembly && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="!p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Total SKUs</p>
              <p className="mt-1 font-mono text-3xl font-bold text-ink">
                {finalAssembly.totalSkus.toLocaleString()}
              </p>
            </Card>
            <Card className="!p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Blended accuracy
              </p>
              <p className="mt-1 font-mono text-3xl font-bold text-teal">
                {finalAssembly.blendedAccuracy}%
              </p>
            </Card>
            <Card className="!p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Sources used</p>
              <p className="mt-1 font-mono text-3xl font-bold text-violet">
                {finalAssembly.summary.length}
              </p>
            </Card>
          </div>

          <Card>
            <CardTitle subtitle="Which template supplies each slice of the final forecast">
              Final forecast source map
            </CardTitle>
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead>
                  <tr>
                    <th className={thClass}>Prediction source</th>
                    <th className={thClass}>SKUs covered</th>
                    <th className={thClass}>Avg accuracy</th>
                    <th className={thClass}>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {finalAssembly.summary.map((s) => (
                    <tr key={s.sourceTemplateId}>
                      <td className={`${tdClass} font-semibold`}>{s.sourceTemplateName}</td>
                      <td className={`${tdClass} font-mono`}>{s.skuCount.toLocaleString()}</td>
                      <td className={`${tdClass} font-mono`}>{s.accuracy}%</td>
                      <td className={tdClass}>
                        {((s.skuCount / finalAssembly.totalSkus) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <CardTitle subtitle="Sample of assembled predictions (one row per SKU)">
                Assembled prediction sample
              </CardTitle>
              <select
                className="input w-40"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All categories</option>
                {jewelleryCategoryStats.map((c) => (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead>
                  <tr>
                    <th className={thClass}>SKU</th>
                    <th className={thClass}>Category</th>
                    <th className={thClass}>City</th>
                    <th className={thClass}>Forecast qty</th>
                    <th className={thClass}>Accuracy</th>
                    <th className={thClass}>Source template</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((r) => (
                    <tr key={r.sku}>
                      <td className={`${tdClass} font-mono font-semibold`}>{r.sku}</td>
                      <td className={tdClass}>{r.category}</td>
                      <td className={tdClass}>{r.city}</td>
                      <td className={`${tdClass} font-mono`}>{r.forecastQty.toLocaleString()}</td>
                      <td className={`${tdClass} font-mono`}>{r.accuracy}%</td>
                      <td className={tdClass}>
                        <Badge tone={r.sourceTemplateId.includes('bridal') ? 'teal' : 'violet'}>
                          {r.sourceTemplateName.replace(/^Template \d+ — /, '')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted">Showing {previewRows.length} of filtered rows.</p>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => {
                addToast({ title: 'Ready for approval', message: 'Assembled forecast locked for review.' });
                navigate('/approval');
              }}
            >
              <Layers3 size={16} /> Continue to approval
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
