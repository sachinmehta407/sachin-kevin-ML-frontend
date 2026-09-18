import type { ReactNode } from 'react';
import { formatNumber, formatPct, SkuRow, AttentionRow } from '../../lib/metrics';

function TableShell({
  title,
  subtitle,
  headers,
  children,
}: {
  title: string;
  subtitle?: string;
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="font-display text-base font-bold text-ink">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-muted">{subtitle}</p> : null}
      </div>
      <div className="overflow-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-canvas/80 text-[10px] uppercase tracking-[0.12em] text-muted">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-3 py-2.5 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} className="px-3 py-6 text-center text-sm text-muted">
        No matching records for current filters.
      </td>
    </tr>
  );
}

export function AttentionTable({ rows }: { rows: AttentionRow[] }) {
  return (
    <TableShell
      title="Products Requiring Attention"
      subtitle="Highest error % first (evaluated records only)"
      headers={['SKU', 'Product', 'Region', 'Error %', 'Variance', 'Direction']}
    >
      {!rows.length ? (
        <EmptyRow cols={6} />
      ) : (
        rows.map((r) => (
          <tr key={`${r.sku}-${r.region}-${r.model}`} className="border-t border-border">
            <td className="px-3 py-2 font-mono text-xs font-semibold">{r.sku}</td>
            <td className="px-3 py-2">{r.product}</td>
            <td className="px-3 py-2">{r.region}</td>
            <td className="px-3 py-2 font-mono">{formatPct(r.errorPct)}</td>
            <td className="px-3 py-2 font-mono">{formatNumber(r.variance)}</td>
            <td className="px-3 py-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  r.biasDirection === 'Over'
                    ? 'bg-coral-soft text-coral'
                    : r.biasDirection === 'Under'
                      ? 'bg-blue-soft text-blue'
                      : 'bg-teal-soft text-teal'
                }`}
              >
                {r.biasDirection}
              </span>
            </td>
          </tr>
        ))
      )}
    </TableShell>
  );
}

export function OverForecastTable({ rows }: { rows: SkuRow[] }) {
  return (
    <TableShell title="Top Over Forecast" subtitle="Forecast > Actual, largest positive variance" headers={['SKU', 'Product', 'Region', 'Actual', 'Forecast', 'Variance']}>
      {!rows.length ? (
        <EmptyRow cols={6} />
      ) : (
        rows.map((r) => (
          <tr key={`over-${r.sku}-${r.region}`} className="border-t border-border">
            <td className="px-3 py-2 font-mono text-xs font-semibold">{r.sku}</td>
            <td className="px-3 py-2">{r.product}</td>
            <td className="px-3 py-2">{r.region}</td>
            <td className="px-3 py-2 font-mono">{formatNumber(r.actual)}</td>
            <td className="px-3 py-2 font-mono">{formatNumber(r.forecast)}</td>
            <td className="px-3 py-2 font-mono text-coral">+{formatNumber(r.variance)}</td>
          </tr>
        ))
      )}
    </TableShell>
  );
}

export function UnderForecastTable({ rows }: { rows: SkuRow[] }) {
  return (
    <TableShell title="Top Under Forecast" subtitle="Forecast < Actual, largest shortfall" headers={['SKU', 'Product', 'Region', 'Actual', 'Forecast', 'Variance']}>
      {!rows.length ? (
        <EmptyRow cols={6} />
      ) : (
        rows.map((r) => (
          <tr key={`under-${r.sku}-${r.region}`} className="border-t border-border">
            <td className="px-3 py-2 font-mono text-xs font-semibold">{r.sku}</td>
            <td className="px-3 py-2">{r.product}</td>
            <td className="px-3 py-2">{r.region}</td>
            <td className="px-3 py-2 font-mono">{formatNumber(r.actual)}</td>
            <td className="px-3 py-2 font-mono">{formatNumber(r.forecast)}</td>
            <td className="px-3 py-2 font-mono text-blue">{formatNumber(r.variance)}</td>
          </tr>
        ))
      )}
    </TableShell>
  );
}

export function ForecastBySkuTable({ rows }: { rows: SkuRow[] }) {
  return (
    <TableShell title="Forecast by SKU" subtitle="Aggregated from filtered evaluated records" headers={['SKU', 'Product', 'Category', 'Region', 'Actual', 'Forecast', 'Error %', 'Model']}>
      {!rows.length ? (
        <EmptyRow cols={8} />
      ) : (
        rows.map((r) => (
          <tr key={`sku-${r.sku}-${r.region}-${r.model}`} className="border-t border-border">
            <td className="px-3 py-2 font-mono text-xs font-semibold">{r.sku}</td>
            <td className="px-3 py-2">{r.product}</td>
            <td className="px-3 py-2">{r.category}</td>
            <td className="px-3 py-2">{r.region}</td>
            <td className="px-3 py-2 font-mono">{formatNumber(r.actual)}</td>
            <td className="px-3 py-2 font-mono">{formatNumber(r.forecast)}</td>
            <td className="px-3 py-2 font-mono">{formatPct(r.errorPct)}</td>
            <td className="px-3 py-2">{r.model}</td>
          </tr>
        ))
      )}
    </TableShell>
  );
}

export function RecommendedTable({ rows }: { rows: SkuRow[] }) {
  return (
    <TableShell title="Recommended Quantities" subtitle="From matching filtered records" headers={['SKU', 'Product', 'Region', 'Recommended', 'Template', 'Status']}>
      {!rows.length ? (
        <EmptyRow cols={6} />
      ) : (
        rows.map((r) => (
          <tr key={`rec-${r.sku}-${r.region}`} className="border-t border-border">
            <td className="px-3 py-2 font-mono text-xs font-semibold">{r.sku}</td>
            <td className="px-3 py-2">{r.product}</td>
            <td className="px-3 py-2">{r.region}</td>
            <td className="px-3 py-2 font-mono font-bold">{formatNumber(r.recommendedQuantity)}</td>
            <td className="px-3 py-2">{r.template}</td>
            <td className="px-3 py-2">{r.status}</td>
          </tr>
        ))
      )}
    </TableShell>
  );
}

export function ModelPerformanceTable({
  rows,
}: {
  rows: Array<{ model: string; wape: number; mape: number; rmse: number; bias: number }>;
}) {
  return (
    <TableShell title="Model Performance" subtitle="Filtered model-level mock evaluation metrics" headers={['Model', 'WAPE', 'MAPE', 'RMSE', 'Bias']}>
      {!rows.length ? (
        <EmptyRow cols={5} />
      ) : (
        rows.map((r) => (
          <tr key={r.model} className="border-t border-border">
            <td className="px-3 py-2 font-semibold">{r.model}</td>
            <td className="px-3 py-2 font-mono">{r.wape.toFixed(1)}%</td>
            <td className="px-3 py-2 font-mono">{r.mape.toFixed(1)}%</td>
            <td className="px-3 py-2 font-mono">{r.rmse.toFixed(1)}</td>
            <td className="px-3 py-2 font-mono">{r.bias > 0 ? '+' : ''}{r.bias.toFixed(1)}%</td>
          </tr>
        ))
      )}
    </TableShell>
  );
}
