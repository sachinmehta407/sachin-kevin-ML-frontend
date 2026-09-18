import { DashboardKpis, formatNumber, formatPct } from '../../lib/metrics';

interface Props {
  kpis: DashboardKpis;
}

function KpiCard({
  label,
  value,
  note,
  accent,
}: {
  label: string;
  value: string;
  note: string;
  accent: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-surface/95 p-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="absolute inset-x-0 top-0 h-0.5" style={{ background: accent }} />
      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{label}</div>
      <div className="mt-2 font-mono text-[1.45rem] font-semibold tracking-tight text-ink">{value}</div>
      <div className="mt-1 text-xs text-muted">{note}</div>
    </div>
  );
}

export function KpiCards({ kpis }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      <KpiCard
        label="Actual Sales"
        value={formatNumber(kpis.actualSales)}
        note={`${kpis.evaluatedCount} evaluated points`}
        accent="#2A66E8"
      />
      <KpiCard
        label="Forecast Sales"
        value={formatNumber(kpis.forecastSales)}
        note="Sum of forecast (evaluated)"
        accent="#5B4FD6"
      />
      <KpiCard
        label="Forecast Accuracy"
        value={formatPct(kpis.accuracy)}
        note={kpis.wape === null ? 'No actuals in range' : `100 − WAPE (${formatPct(kpis.wape)})`}
        accent="#0C9587"
      />
      <KpiCard
        label="Forecast Bias"
        value={formatPct(kpis.bias)}
        note="Σ(F − A) / Σ(A)"
        accent="#B86E08"
      />
      <KpiCard
        label="Over Forecast %"
        value={formatPct(kpis.overForecastPct)}
        note={`${kpis.overCount} series beyond +10%`}
        accent="#D44545"
      />
      <KpiCard
        label="Under Forecast %"
        value={formatPct(kpis.underForecastPct)}
        note={`${kpis.underCount} series beyond −10%`}
        accent="#C23A8A"
      />
    </div>
  );
}
