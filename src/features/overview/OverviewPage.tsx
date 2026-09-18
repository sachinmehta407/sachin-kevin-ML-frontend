import { ArrowRight, CheckCircle2, Database, Gauge, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { recentActivity } from '../../data/activity';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { KpiStat } from '../../components/ui/KpiStat';

export function OverviewPage() {
  const navigate = useNavigate();
  const { demoLoaded, loadDemo, addToast } = useAppStore();
  const start = () => {
    loadDemo();
    addToast({ title: 'Demo workspace loaded', message: 'Three sales files are ready for review.' });
    navigate('/ingestion');
  };

  const steps = [
    'Connect and map sales history',
    'Resolve data quality findings',
    'Standardize and explore demand',
    'Train and compare candidates',
    'Review overrides and approve',
  ];

  return (
    <div className="space-y-5">
      <section className="mesh-card panel relative overflow-hidden shadow-lift">
        <div className="hero-grid absolute inset-0" />
        <div className="relative grid gap-6 p-6 md:gap-8 md:p-8 lg:grid-cols-[1.35fr_0.9fr] lg:items-stretch">
          <div className="flex flex-col justify-center">
            <p className="font-display text-[13px] font-bold tracking-[0.04em] text-violet">
              Forecast Control Room
            </p>
            <h1 className="font-display mt-3 max-w-xl text-[2.35rem] font-extrabold leading-[1.05] text-ink md:text-5xl">
              Build a trusted sales forecast
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted md:text-[15px]">
              Guided workflow from raw sales files through validation, AutoML, business review and
              approval.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button onClick={start} className="h-11 px-5">
                {demoLoaded ? 'Continue workflow' : 'Load demo data'}
                <ArrowRight size={17} />
              </Button>
              <p className="text-xs text-muted">Demo mode · no live APIs</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 self-center">
            <KpiStat
              label="Source rows"
              value="354,130"
              detail="3 annual files"
              icon={<Database size={15} />}
            />
            <KpiStat
              label="Quality"
              value="96.4%"
              detail="6 findings"
              icon={<CheckCircle2 size={15} />}
            />
            <KpiStat
              label="Candidate WAPE"
              value="10.9%"
              detail="+1.7 vs prod"
              icon={<Gauge size={15} />}
            />
            <KpiStat
              label="Decisions"
              value="3"
              detail="Open items"
              icon={<TriangleAlert size={15} />}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <Card>
          <CardTitle subtitle="Stage-gated from ingest to approval">Workflow progress</CardTitle>
          <div className="space-y-2">
            {steps.map((x, i) => (
              <div
                key={x}
                className="flex items-center gap-3 rounded-xl bg-canvas/70 px-3 py-2.5 transition hover:bg-canvas"
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded-lg text-[11px] font-bold ${
                    i === 0 ? 'bg-teal text-white' : 'bg-violet-soft text-violet'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-ink">{x}</span>
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-muted">
                  {i === 0 ? 'Ready' : 'Next'}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>Recent activity</CardTitle>
          <div className="space-y-3.5">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-violet to-teal" />
                <div>
                  <p className="text-sm font-semibold text-ink">{a.text}</p>
                  <p className="text-xs text-muted">
                    {a.actor} · {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
