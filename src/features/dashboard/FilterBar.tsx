import { CATEGORIES, productsForCategory, skusForProduct } from '../../data/catalog';
import {
  ALL_CATEGORIES,
  ALL_MODELS,
  ALL_PRODUCTS,
  ALL_REGIONS,
  ALL_SKUS,
  ALL_TEMPLATES,
  ForecastDashboardFilters,
  MODELS,
  REGIONS,
  TEMPLATES,
} from '../../types/forecast';

interface Props {
  filters: ForecastDashboardFilters;
  onChange: (key: keyof ForecastDashboardFilters, value: string) => void;
  onReset: () => void;
  matchCount: number;
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex min-w-[140px] flex-1 flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{label}</span>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterBar({ filters, onChange, onReset, matchCount }: Props) {
  const productOptions = [ALL_PRODUCTS, ...productsForCategory(filters.category)];
  const skuOptions = [ALL_SKUS, ...skusForProduct(filters.category, filters.product)];

  return (
    <div className="panel p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-base font-bold text-ink">Filters</h2>
          <p className="text-xs text-muted">
            AND logic across all selections ·{' '}
            <span className="font-mono font-semibold text-violet">
              {matchCount.toLocaleString()}
            </span>{' '}
            matching records
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-border/80 bg-canvas px-3.5 py-2 text-xs font-bold text-ink transition hover:border-violet/30 hover:bg-violet-soft hover:text-violet"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <label className="flex min-w-[140px] flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            Date From
          </span>
          <input
            type="date"
            className="input"
            value={filters.dateFrom}
            onChange={(e) => onChange('dateFrom', e.target.value)}
          />
        </label>
        <label className="flex min-w-[140px] flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Date To</span>
          <input
            type="date"
            className="input"
            value={filters.dateTo}
            onChange={(e) => onChange('dateTo', e.target.value)}
          />
        </label>
        <SelectField
          label="Category"
          value={filters.category}
          options={[ALL_CATEGORIES, ...CATEGORIES]}
          onChange={(v) => onChange('category', v)}
        />
        <SelectField
          label="Product"
          value={filters.product}
          options={productOptions}
          onChange={(v) => onChange('product', v)}
        />
        <SelectField
          label="SKU"
          value={filters.sku}
          options={skuOptions}
          onChange={(v) => onChange('sku', v)}
        />
        <SelectField
          label="Region"
          value={filters.region}
          options={[ALL_REGIONS, ...REGIONS]}
          onChange={(v) => onChange('region', v)}
        />
        <SelectField
          label="Forecast Model"
          value={filters.model}
          options={[ALL_MODELS, ...MODELS]}
          onChange={(v) => onChange('model', v)}
        />
        <SelectField
          label="Forecast Template"
          value={filters.template}
          options={[ALL_TEMPLATES, ...TEMPLATES]}
          onChange={(v) => onChange('template', v)}
        />
      </div>
    </div>
  );
}
