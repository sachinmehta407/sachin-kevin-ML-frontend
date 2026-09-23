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

/** App chart palette */
export const chartColors = {
  primary: '#25CFFD',
  secondary: '#A0FCAA',
  accent: '#63E6D4',
} as const;

/** Semantic series colors mapped onto the chart palette */
export const COLORS = {
  actual: chartColors.primary,
  forecast: chartColors.accent,
  teal: chartColors.accent,
  coral: chartColors.secondary,
  amber: chartColors.secondary,
  within: chartColors.accent,
  over: chartColors.secondary,
  under: chartColors.primary,
  wape: chartColors.secondary,
} as const;

/** Multi-series / categorical fills cycling primary → secondary → accent */
export const PIE_COLORS = [
  chartColors.primary,
  chartColors.secondary,
  chartColors.accent,
  '#1BA8D4',
  '#7FE08A',
  '#4BC4B4',
  '#0E8FB0',
] as const;

export const MODEL_COLORS = [
  chartColors.primary,
  chartColors.secondary,
  chartColors.accent,
  '#1BA8D4',
  '#7FE08A',
  '#4BC4B4',
] as const;
