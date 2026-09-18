export const trendSeries = Array.from({ length: 36 }, (_, i) => ({
  month: new Date(2023, i, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
  sales: Math.round(820 + i * 12 + Math.sin(i / 2.1) * 95 + (i % 12 === 10 ? 180 : 0)),
  trend: Math.round(825 + i * 12),
}));

export const seasonalitySeries = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month, i) => ({
  month,
  index: Math.round((0.86 + Math.sin((i - 2) / 1.8) * 0.1 + (i > 9 ? 0.22 : 0)) * 100),
}));

export const acfSeries = Array.from({ length: 25 }, (_, lag) => ({
  lag,
  correlation: lag === 0 ? 1 : Number((Math.cos(lag * Math.PI / 6) * Math.exp(-lag / 22)).toFixed(2)),
}));
