/** Shared Recharts theme tokens that follow `data-theme` CSS variables. */
export const chartGrid = 'var(--chart-grid)';
export const chartTick = { fontSize: 11, fill: 'var(--chart-tick)' } as const;
export const chartTickSm = { fontSize: 10, fill: 'var(--chart-tick)' } as const;
export const chartTooltipStyle = {
  backgroundColor: 'var(--chart-tooltip-bg)',
  border: '1px solid var(--chart-tooltip-border)',
  borderRadius: 12,
  color: 'rgb(var(--color-ink))',
  boxShadow: 'var(--shadow-soft)',
} as const;
