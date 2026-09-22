import {
  baselineAccuracyForSku,
  forecastQtyForSku,
  jewelleryCorpus,
  matchScope,
} from '../data/jewelleryCorpus';
import type {
  AssemblySummaryRow,
  FinalForecastAssembly,
  ForecastTemplate,
  SkuPrediction,
} from '../types/jewellery';

/**
 * Final Forecast = baseline for everything EXCEPT slices replaced by
 * higher-priority approved scoped templates. Exactly one prediction per SKU.
 * Higher priority wins on overlap (more specific experiments should use higher priority).
 */
export function assembleFinalForecast(templates: ForecastTemplate[]): FinalForecastAssembly {
  const approved = templates
    .filter((t) => t.status === 'approved' && t.accuracy != null)
    .sort((a, b) => a.priority - b.priority); // low first; later overwrite

  const baseline = approved.find((t) => t.isBaseline) ?? approved[0];
  const overlays = approved.filter((t) => t.id !== baseline?.id);

  const bySku = new Map<string, SkuPrediction>();

  const applyTemplate = (tpl: ForecastTemplate) => {
    const accuracy = tpl.accuracy ?? 80;
    for (const sku of jewelleryCorpus) {
      if (!matchScope(sku, tpl.scope)) continue;
      bySku.set(sku.sku, {
        sku: sku.sku,
        category: sku.category,
        region: sku.region,
        city: sku.city,
        product: sku.product,
        forecastQty: forecastQtyForSku(sku, accuracy),
        accuracy: tpl.isBaseline ? baselineAccuracyForSku(sku) : accuracy,
        sourceTemplateId: tpl.id,
        sourceTemplateName: tpl.name,
      });
    }
  };

  if (baseline) applyTemplate(baseline);
  // overlays in ascending priority — higher priority applied last wins
  for (const tpl of overlays.sort((a, b) => a.priority - b.priority)) {
    applyTemplate(tpl);
  }

  const predictions = [...bySku.values()].sort((a, b) => a.sku.localeCompare(b.sku));

  const summaryMap = new Map<string, AssemblySummaryRow>();
  for (const p of predictions) {
    const key = p.sourceTemplateId;
    const cur = summaryMap.get(key) ?? {
      label: p.sourceTemplateName,
      skuCount: 0,
      sourceTemplateId: p.sourceTemplateId,
      sourceTemplateName: p.sourceTemplateName,
      accuracy: 0,
    };
    cur.skuCount += 1;
    cur.accuracy += p.accuracy;
    summaryMap.set(key, cur);
  }

  const summary = [...summaryMap.values()]
    .map((s) => ({
      ...s,
      accuracy: s.skuCount ? Number((s.accuracy / s.skuCount).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.skuCount - a.skuCount);

  const blendedAccuracy = predictions.length
    ? Number(
        (
          predictions.reduce((sum, p) => sum + p.accuracy, 0) / predictions.length
        ).toFixed(1),
      )
    : 0;

  return {
    totalSkus: predictions.length,
    predictions,
    summary,
    blendedAccuracy,
    assembledAt: new Date().toISOString(),
  };
}

export function suggestedAccuracyForScope(
  scope: ForecastTemplate['scope'],
  models: string[],
): number {
  // Mock: Health Beauty scoped experiments get a stronger lift
  const healthOnly =
    scope.categories?.length === 1 &&
    scope.categories[0] === 'Health Beauty' &&
    !scope.cities?.length &&
    !scope.regions?.length &&
    !scope.skus?.length;
  if (healthOnly) return 88;
  if (scope.skus?.length) return 91;
  if (scope.cities?.length && scope.categories?.length) return 87;
  if (scope.cities?.length || scope.regions?.length) return 85;
  if (scope.categories?.length) return 84;
  return 83 + Math.min(3, models.length);
}
