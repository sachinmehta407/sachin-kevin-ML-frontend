import type { ReactNode } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { chartGrid, chartTick, chartTickSm, chartTooltipStyle, COLORS, MODEL_COLORS, PIE_COLORS } from '../../lib/chartTheme';
import { DirectionSlice, MonthSeriesPoint } from '../../lib/metrics';

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="panel p-4 transition duration-200 hover:shadow-lift md:p-5">
      <h3 className="font-display text-base font-bold text-ink">{title}</h3>
      {subtitle ? <p className="mb-3 mt-0.5 text-xs text-muted">{subtitle}</p> : <div className="mb-3" />}
      <div className="h-72 w-full">{children}</div>
    </div>
  );
}

/** 1. Area Chart */
export function AreaChartView({ data }: { data: MonthSeriesPoint[] }) {
  return (
    <ChartCard title="Area Chart" subtitle="Actual vs forecast demand over time">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="areaActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.actual} stopOpacity={0.4} />
              <stop offset="100%" stopColor={COLORS.actual} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="areaForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.forecast} stopOpacity={0.4} />
              <stop offset="100%" stopColor={COLORS.forecast} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
          <XAxis dataKey="month" tick={chartTick} />
          <YAxis tick={chartTick} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend />
          <Area type="monotone" dataKey="actual" name="Actual" stroke={COLORS.actual} fill="url(#areaActual)" strokeWidth={2} />
          <Area type="monotone" dataKey="forecast" name="Forecast" stroke={COLORS.forecast} fill="url(#areaForecast)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/** 2. Bar Chart */
export function BarChartView({
  data,
}: {
  data: Array<{ name: string; actual: number; forecast: number }>;
}) {
  return (
    <ChartCard title="Bar Chart" subtitle="Actual vs forecast by region">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
          <XAxis dataKey="name" tick={chartTick} />
          <YAxis tick={chartTick} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend />
          <Bar dataKey="actual" name="Actual" fill={COLORS.actual} radius={[6, 6, 0, 0]} />
          <Bar dataKey="forecast" name="Forecast" fill={COLORS.forecast} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/** 3. Bubble Chart */
export function BubbleChartView({
  data,
}: {
  data: Array<{ actual: number; forecast: number; size: number; sku: string }>;
}) {
  return (
    <ChartCard title="Bubble Chart" subtitle="Actual vs forecast · bubble size = error magnitude">
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
          <XAxis type="number" dataKey="actual" name="Actual" tick={chartTick} />
          <YAxis type="number" dataKey="forecast" name="Forecast" tick={chartTick} />
          <ZAxis type="number" dataKey="size" range={[60, 400]} name="Error size" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={chartTooltipStyle} />
          <Scatter name="SKUs" data={data} fill={COLORS.forecast} fillOpacity={0.65} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/** 4a. Doughnut Chart */
export function DoughnutChartView({ data }: { data: DirectionSlice[] }) {
  const palette = [COLORS.within, COLORS.over, COLORS.under];
  return (
    <ChartCard title="Doughnut Chart" subtitle="Forecast direction · within / over / under">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={90} paddingAngle={3}>
            {data.map((_, i) => (
              <Cell key={i} fill={palette[i % palette.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/** 4b. Pie Chart */
export function PieChartView({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <ChartCard title="Pie Chart" subtitle="Forecast share by category">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/** 5. Line Chart */
export function LineChartView({ data }: { data: MonthSeriesPoint[] }) {
  return (
    <ChartCard title="Line Chart" subtitle="Actual vs forecast trend lines">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
          <XAxis dataKey="month" tick={chartTick} />
          <YAxis tick={chartTick} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend />
          <Line type="monotone" dataKey="actual" name="Actual" stroke={COLORS.actual} strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="forecast" name="Forecast" stroke={COLORS.forecast} strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/** 6. Mixed Chart Types */
export function MixedChartView({ data }: { data: MonthSeriesPoint[] }) {
  return (
    <ChartCard title="Mixed Chart Types" subtitle="Bars for volume + line for WAPE %">
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
          <XAxis dataKey="month" tick={chartTick} />
          <YAxis yAxisId="left" tick={chartTick} />
          <YAxis yAxisId="right" orientation="right" tick={chartTick} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend />
          <Bar yAxisId="left" dataKey="forecast" name="Forecast" fill={COLORS.forecast} radius={[4, 4, 0, 0]} />
          <Bar yAxisId="left" dataKey="actual" name="Actual" fill={COLORS.actual} radius={[4, 4, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="wape" name="WAPE %" stroke={COLORS.wape} strokeWidth={2.5} dot />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/** 7. Polar Area Chart (RadialBar approximation) */
export function PolarAreaChartView({
  data,
}: {
  data: Array<{ name: string; value: number; fill: string }>;
}) {
  return (
    <ChartCard title="Polar Area Chart" subtitle="Forecast volume by region (radial)">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="18%"
          outerRadius="90%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 'dataMax']} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={4} name="Forecast volume">
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </RadialBar>
          <Legend />
          <Tooltip
            contentStyle={chartTooltipStyle}
            formatter={(value, _name, item) => [
              value,
              (item?.payload as { name?: string } | undefined)?.name ?? 'Region',
            ]}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/** 8. Radar Chart */
export function RadarChartView({
  data,
  models,
}: {
  data: Array<Record<string, string | number>>;
  models: string[];
}) {
  return (
    <ChartCard title="Radar Chart" subtitle="Model score comparison · higher is better">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke={chartGrid} />
          <PolarAngleAxis dataKey="metric" tick={chartTick} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={chartTickSm} />
          {models.map((m, i) => (
            <Radar
              key={m}
              name={m}
              dataKey={m}
              stroke={MODEL_COLORS[i % MODEL_COLORS.length]}
              fill={MODEL_COLORS[i % MODEL_COLORS.length]}
              fillOpacity={0.18}
              strokeWidth={2}
            />
          ))}
          <Legend />
          <Tooltip contentStyle={chartTooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/** 9. Funnel Chart */
export function FunnelChartView({
  data,
}: {
  data: Array<{ name: string; value: number; fill: string }>;
}) {
  return (
    <ChartCard
      title="Funnel Chart"
      subtitle="Forecast volume funnel · total → evaluated → within tolerance → recommended"
    >
      <ResponsiveContainer>
        <FunnelChart margin={{ top: 8, right: 120, bottom: 8, left: 16 }}>
          <Tooltip contentStyle={chartTooltipStyle} />
          <Funnel dataKey="value" data={data} isAnimationActive nameKey="name">
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={entry.fill ?? PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
            <LabelList
              position="right"
              fill="rgb(var(--color-ink))"
              stroke="none"
              dataKey="name"
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
