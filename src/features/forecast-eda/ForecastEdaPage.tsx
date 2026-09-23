import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StageBanner } from '../../components/layout/StageBanner';
import { Button } from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/Page';
import { acfSeries, seasonalitySeries, trendSeries } from '../../data/edaData';
import { chartColors, chartGrid, chartTickSm, chartTooltipStyle } from '../../lib/chartTheme';
import { useAppStore } from '../../store/useAppStore';

const axes = chartTickSm;
export function ForecastEdaPage() {
  const nav = useNavigate();
  const complete = useAppStore((s) => s.completeStage);
  const next = () => {
    complete('eda', 'model-selection');
    nav('/model-selection');
  };
  return (
    <div>
      <StageBanner stage="eda" prerequisite="Approve the prepared dataset first." />
      <PageHeader
        eyebrow="Analysis · Step 4"
        title="Understand forecastability"
        description="Inspect trend, recurring seasonal structure and lag correlation before choosing candidates."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="xl:col-span-2">
          <CardTitle subtitle="Monthly sales with smoothed growth signal">Demand trend</CardTitle>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={trendSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                <XAxis dataKey="month" tick={axes} />
                <YAxis tick={axes} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line dataKey="sales" stroke={chartColors.primary} strokeWidth={2} dot={false} />
                <Line dataKey="trend" stroke={chartColors.accent} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle>Monthly seasonality index</CardTitle>
          <div className="h-60">
            <ResponsiveContainer>
              <BarChart data={seasonalitySeries}>
                <XAxis dataKey="month" tick={axes} />
                <YAxis tick={axes} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="index" fill={chartColors.primary} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle>Autocorrelation by lag</CardTitle>
          <div className="h-60">
            <ResponsiveContainer>
              <BarChart data={acfSeries}>
                <XAxis dataKey="lag" tick={axes} />
                <YAxis domain={[-1, 1]} tick={axes} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="correlation" fill={chartColors.secondary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="mt-5 flex justify-end">
        <Button onClick={next}>
          Select models
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
