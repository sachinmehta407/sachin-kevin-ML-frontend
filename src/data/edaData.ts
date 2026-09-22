import { olistMonthlyGmv } from './olist';

const monthly = olistMonthlyGmv();

export const trendSeries = monthly.map((row, i) => {
  const [y, m] = row.monthKey.split('-').map(Number);
  const label = new Date(y, m - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  });
  const trend =
    i === 0
      ? row.sales
      : Math.round((monthly.slice(0, i + 1).reduce((s, r) => s + r.sales, 0) / (i + 1)) * 10) / 10;
  return {
    month: label,
    sales: Math.round(row.sales),
    trend: Math.round(trend),
  };
});

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const byCalendarMonth = new Map<number, number[]>();
for (const row of monthly) {
  const monthIdx = Number(row.monthKey.slice(5, 7)) - 1;
  const list = byCalendarMonth.get(monthIdx) ?? [];
  list.push(row.sales);
  byCalendarMonth.set(monthIdx, list);
}
const overallAvg =
  monthly.reduce((s, r) => s + r.sales, 0) / Math.max(1, monthly.length) || 1;

export const seasonalitySeries = monthNames.map((month, i) => {
  const vals = byCalendarMonth.get(i) ?? [];
  const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : overallAvg;
  return {
    month,
    index: Math.round((avg / overallAvg) * 100),
  };
});

export const acfSeries = Array.from({ length: 25 }, (_, lag) => ({
  lag,
  correlation: lag === 0 ? 1 : Number((Math.cos((lag * Math.PI) / 6) * Math.exp(-lag / 22)).toFixed(2)),
}));
