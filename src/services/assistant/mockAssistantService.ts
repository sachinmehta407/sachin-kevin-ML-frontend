import type {
  AssistantContext,
  AssistantPrompt,
  AssistantReply,
  AssistantService,
  AssistantStageBrief,
} from './types';

function delay(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stagePrompts(stageId: string): AssistantPrompt[] {
  const map: Record<string, AssistantPrompt[]> = {
    overview: [
      { id: 'ov1', label: 'Where should I start?', prompt: 'Where should I start in this forecast workflow?' },
      { id: 'ov2', label: 'What is incomplete?', prompt: 'What still needs attention in the current run?' },
    ],
    ingestion: [
      { id: 'in1', label: 'Explain column mapping', prompt: 'Explain the column mappings for this dataset.' },
      { id: 'in2', label: 'Demo files', prompt: 'What demo files are loaded and how do they relate?' },
    ],
    quality: [
      { id: 'q1', label: 'Critical issues', prompt: 'Which data quality issues are critical and why?' },
      { id: 'q2', label: 'My decisions', prompt: 'Summarize my data quality accept/reject decisions.' },
    ],
    standardization: [
      { id: 's1', label: 'Transformations', prompt: 'Explain the standardization transformations applied.' },
      { id: 's2', label: 'Why approve?', prompt: 'Why must I approve the prepared dataset before forecasting?' },
    ],
    eda: [
      { id: 'e1', label: 'Seasonality', prompt: 'What seasonality and trend did EDA find?' },
      { id: 'e2', label: 'Intermittent SKUs', prompt: 'Why are intermittent SKUs important for model choice?' },
    ],
    'model-selection': [
      { id: 'm1', label: 'Why XGBoost?', prompt: 'Why was XGBoost selected as a candidate model?' },
      { id: 'm2', label: 'Why exclude DL?', prompt: 'Why was deep learning excluded?' },
    ],
    training: [
      { id: 't1', label: 'Backtest setup', prompt: 'Explain the training and backtesting split.' },
      { id: 't2', label: 'Training status', prompt: 'What is the current training status?' },
    ],
    dashboard: [
      { id: 'd1', label: 'Current filters', prompt: 'How do the current dashboard filters affect the KPIs?' },
      { id: 'd2', label: 'Accuracy', prompt: 'Explain forecast accuracy and WAPE for the filtered view.' },
      { id: 'd3', label: 'Recommended qty', prompt: 'How should I read recommended quantities?' },
    ],
    'segment-performance': [
      { id: 'b1', label: 'Under-forecast', prompt: 'Where are we consistently under-forecasting?' },
      { id: 'b2', label: 'Worst categories', prompt: 'Which categories have the worst forecast accuracy?' },
    ],
    experiments: [
      { id: 'x1', label: 'Compare experiments', prompt: 'Compare Default with Experiment A.' },
      { id: 'x2', label: 'When to experiment', prompt: 'When should I create a new experiment instead of changing Default?' },
    ],
    ensemble: [
      { id: 'en1', label: 'Weight meaning', prompt: 'Explain how ensemble weights create the final forecast.' },
      { id: 'en2', label: 'Weights valid?', prompt: 'Are my ensemble weights valid?' },
    ],
    overrides: [
      { id: 'o1', label: 'Selective override', prompt: 'How do selective forecast overrides work without rerunning all SKUs?' },
      { id: 'o2', label: 'Current overrides', prompt: 'Summarize the current forecast overrides.' },
    ],
    'template-compare': [
      { id: 'tc1', label: 'Missing delta', prompt: 'What is still missing between these templates?' },
      { id: 'tc2', label: 'No full restart', prompt: 'Why does template compare not restart from ingestion?' },
    ],
    approval: [
      { id: 'a1', label: 'Approve criteria', prompt: 'What should I review before approving the forecast?' },
      { id: 'a2', label: 'Approval status', prompt: 'What is the current approval status?' },
    ],
    versions: [
      { id: 'v1', label: 'Version history', prompt: 'Explain the forecast version history.' },
      { id: 'v2', label: 'What changed', prompt: 'What typically changes between forecast versions?' },
    ],
  };
  return map[stageId] ?? map.overview;
}

function briefFor(context: AssistantContext): AssistantStageBrief {
  const prompts = stagePrompts(context.stageId);
  const statusNote =
    context.stageStatus === 'locked'
      ? 'This stage is still locked for editing, but you can preview it.'
      : context.stageStatus === 'complete'
        ? 'This stage is marked complete in the demo workflow.'
        : `Stage status: ${context.stageStatus}.`;

  const summaries: Record<string, string> = {
    overview: `You are in the Forecast Control Room overview. ${statusNote} ${context.insights[0] ?? 'Load the demo dataset to begin.'}`,
    ingestion: context.demoLoaded
      ? `Demo sales files are loaded. Map date, SKU, quantity, and region roles, then confirm validation.`
      : `No dataset loaded yet. Use Load demo files to simulate ingestion without parsing Excel.`,
    quality: `${context.pendingQualityIssues} issue(s) pending, ${context.acceptedQualityIssues} accepted/modified, ${context.rejectedQualityIssues} rejected. Critical issues should be decided before continuing.`,
    standardization: context.preparedApproved
      ? `Prepared dataset is approved. Transformations are frozen for downstream forecasting stages.`
      : `Review transform audit rows, then approve the standardized dataset before EDA and training.`,
    eda: `EDA summarizes trend, seasonality, stationarity, and intermittency to justify model families.`,
    'model-selection': `Currently selected: ${context.selectedModels.join(', ') || 'none'}. Keep at least one baseline and one candidate.`,
    training: context.trainingComplete
      ? `Training simulation is complete. Review metrics before dashboard and bias analysis.`
      : `Training is ${context.trainingStatus}. This demo simulates progress logs — no live model fit runs.`,
    dashboard: `Dashboard filters: ${context.dashboardFilters.category} · ${context.dashboardFilters.region} · ${context.dashboardFilters.model} · ${context.dashboardFilters.template}. KPIs recompute from filtered mock records.`,
    'segment-performance': `Use bias and WAPE by category/region to find systematic over/under forecast patterns.`,
    experiments: `${context.experimentCount} experiment(s) in state. Experiments should not replace Default until override/assembly.`,
    ensemble: context.ensembleValid
      ? `Ensemble weights total 100%: ${Object.entries(context.ensembleWeights).map(([k, v]) => `${k} ${v}%`).join(', ')}.`
      : `Ensemble weights are invalid until they sum to exactly 100%.`,
    overrides: `${context.overrideCount} override(s) stored. Only selected SKUs change source — others keep Default.`,
    'template-compare': `Comparing ${context.templateA} vs ${context.templateB}. Missing-delta reuse skips ingestion through EDA.`,
    approval: `Approval status is "${context.approvalStatus}". Approve only after training and review are complete.`,
    versions: `${context.versionCount} version record(s) available. Approved forecasts create a new version entry in this demo.`,
  };

  return {
    stageId: context.stageId,
    title: context.stageLabel,
    summary: summaries[context.stageId] ?? statusNote,
    prompts,
  };
}

function matchAnswer(question: string, context: AssistantContext): string {
  const q = question.toLowerCase();
  const f = context.dashboardFilters;

  if (q.includes('start') || q.includes('where should')) {
    if (!context.demoLoaded) return 'Start at Ingestion and click Load demo files. That unlocks Data Quality without any real Excel parsing.';
    if (context.pendingQualityIssues > 0) return `Demo data is loaded. Next, resolve the ${context.pendingQualityIssues} pending data-quality decision(s), especially critical/high severity.`;
    if (!context.preparedApproved) return 'Continue to Standardization, review the transform audit, then Approve Standardized Dataset.';
    if (!context.trainingComplete) return 'Proceed through EDA and Model Selection, then run the simulated training.';
    return 'Training is done. Use the Dashboard and Segment & Bias pages, then Experiments / Template Compare before Approval.';
  }

  if (q.includes('attention') || q.includes('incomplete') || q.includes('needs attention')) {
    if (!context.insights.length) return 'Nothing critical is flagged in the current mock workflow state.';
    return `Current attention items:\n• ${context.insights.join('\n• ')}`;
  }

  if (q.includes('column mapping') || q.includes('mappings')) {
    return 'Map source columns to forecasting roles: date → Sales Date, sku → SKU, quantity → Sales Quantity, category/region → dimensions. Confidence scores are simulated; you can edit mappings before Confirm & validate.';
  }

  if (q.includes('demo file') || q.includes('sales_202')) {
    return context.demoLoaded
      ? 'Loaded mock files cover Jan 2023–Sep 2025 across three annual extracts. They are treated as one sequential history for append + dedupe in this demo.'
      : 'No files are loaded yet. Use Load demo files to populate Sales_2023 / 2024 / 2025 mock metadata.';
  }

  if (q.includes('critical') || (q.includes('quality') && q.includes('issue'))) {
    return 'The critical mock issue is Incomplete recent week (partial latest week volume). High issues include missing sales and extreme spikes. Accept/Reject/Modify decisions stay in browser state while you navigate.';
  }

  if (q.includes('accept') || q.includes('reject') || q.includes('decision')) {
    return `Quality decisions so far — pending: ${context.pendingQualityIssues}, accepted/modified: ${context.acceptedQualityIssues}, rejected: ${context.rejectedQualityIssues}. High/critical items should not stay pending before standardization.`;
  }

  if (q.includes('transform') || q.includes('standardiz')) {
    return context.preparedApproved
      ? 'Standardization is approved. Applied transforms (category cleanup, date ISO normalization, duplicate handling) are treated as frozen lineage for EDA and training.'
      : 'Standardization shows before → after transform rows from accepted quality actions. Approving the prepared dataset is the gate before forecasting stages.';
  }

  if (q.includes('approve') && q.includes('prepared')) {
    return 'Approving the prepared dataset freezes the cleaned table used by EDA/training. In this demo, Model Training stays gated until that approval exists.';
  }

  if (q.includes('seasonality') || q.includes('trend') || q.includes('eda')) {
    return 'Mock EDA shows an upward trend (~+8% YoY), strong annual seasonality (Nov–Dec peak), non-stationary ADF on raw series, and ~214 intermittent SKUs. Those findings support seasonal statistical models plus tree models for promo/sparse tails.';
  }

  if (q.includes('intermittent')) {
    return 'Intermittent SKUs have many zero periods. Portfolio models can look accurate overall while failing on sparse items — that is why LightGBM / intermittent-tail experiments exist in later stages.';
  }

  if (q.includes('xgboost') || (q.includes('why') && q.includes('select'))) {
    return `XGBoost is shortlisted because it can capture promotions and nonlinear drivers. Current selection: ${context.selectedModels.join(', ') || 'none'}. SARIMA/Holt-Winters remain for seasonal explainability; Seasonal Naive is the transparent baseline.`;
  }

  if (q.includes('deep learning') || q.includes('lstm') || q.includes('transformer') || q.includes('excluded')) {
    return 'Deep learning (LSTM/Transformer) is excluded in this demo because history depth is only ~33 months per series — not enough for reliable sequence models versus SARIMA / Holt-Winters / XGBoost.';
  }

  if (q.includes('backtest') || q.includes('train') && q.includes('split') || q.includes('training status') || q.includes('training')) {
    if (q.includes('status')) {
      return context.trainingComplete
        ? 'Training simulation is complete. Logs show prepared data → feature gen → model fits → evaluation. Metrics are precomputed mock results.'
        : `Training status is "${context.trainingStatus}". Click Run Models to simulate the pipeline; no live sklearn/XGBoost fit is executed.`;
    }
    return 'Mock backtest uses a time-based split: train on earlier months, evaluate on a later holdout (e.g. early 2026). Future periods are never mixed into training — only simulated here.';
  }

  if (q.includes('filter') || q.includes('kpi') || (q.includes('dashboard') && q.includes('affect'))) {
    return `Active filters (AND): Category=${f.category}, Product=${f.product}, SKU=${f.sku}, Region=${f.region}, Model=${f.model}, Template=${f.template}. Actual/Forecast/Accuracy/Bias and charts all recompute from the filtered ForecastRecord mock set.`;
  }

  if (q.includes('wape') || q.includes('accuracy')) {
    return 'Accuracy % = 100 − WAPE. WAPE = Σ|Actual−Forecast| / Σ|Actual| × 100. Records with Actual = null (future periods) are excluded from historical accuracy. Bias = Σ(Forecast−Actual) / Σ(Actual) × 100.';
  }

  if (q.includes('recommended')) {
    return 'Recommended quantity comes from the filtered mock records (usually ~forecast with a small planning buffer). On the Dashboard, the Recommended Quantities table shows the latest matching SKU/region values for the current filter slice.';
  }

  if (q.includes('under-forecast') || q.includes('under forecast') || q.includes('over-forecast') || q.includes('over forecast') || q.includes('bias')) {
    return 'Under-forecast means Forecast < Actual; over-forecast means Forecast > Actual. Segment & Bias highlights categories/regions with persistent directional error (mock: Apparel / West often flagged). Use Products Requiring Attention for highest error %.';
  }

  if (q.includes('worst') && q.includes('categor')) {
    return 'In the mock portfolio, promotional/volatile categories (e.g. Apparel / Electronics-like segments) show higher WAPE than staples. Open Segment & Bias or Dashboard → Accuracy by Category with filters applied.';
  }

  if (q.includes('experiment') || q.includes('default with')) {
    return `There are ${context.experimentCount} experiment(s). Default covers the broad portfolio; Exp A/B/C target slices (region, high-value, intermittent). Compare on WAPE, bias, and business score — do not pick a winner on one metric alone.`;
  }

  if (q.includes('ensemble') || q.includes('weight')) {
    const detail = Object.entries(context.ensembleWeights).map(([k, v]) => `${k}=${v}%`).join(', ');
    return context.ensembleValid
      ? `Weights are valid (${detail}). Final = Σ(model forecast × weight). Example: 110×0.5 + 100×0.3 + 105×0.2.`
      : `Weights currently sum incorrectly (${detail}). Adjust sliders until the total is exactly 100%.`;
  }

  if (q.includes('override') || q.includes('selective')) {
    return context.overrideCount
      ? `You have ${context.overrideCount} override(s). Each SKU keeps a forecast source (Default / Experiment / Manual). Changing one SKU does not retrain the other ~950.`
      : 'Selective override lets most SKUs keep Default while a small set uses an experiment or manual value — without restarting the full pipeline.';
  }

  if (q.includes('missing') && (q.includes('template') || q.includes('delta') || q.includes('between'))) {
    return `Template compare (${context.templateA} vs ${context.templateB}) reuses ingestion→EDA, then queues only SKU/metric gaps. Run Missing Delta simulates skip/reuse/run/done logs — it does not restart Stage 1.`;
  }

  if (q.includes('not restart') || q.includes('from ingestion') || q.includes('full restart')) {
    return 'Same Standardized Dataset v3 is assumed. Stages 1–4 are reuse/skip. Model selection may be partial; training, bias, and scoring run only for the missing subset.';
  }

  if (q.includes('approval') || q.includes('before approving') || q.includes('review before')) {
    return context.trainingComplete
      ? `Review dashboard accuracy/bias, overrides, and template lineage before approval. Current status: ${context.approvalStatus}.`
      : 'Complete training (and preferably dashboard/bias review) before approving. Approval is blocked in spirit until the training simulation finishes.';
  }

  if (q.includes('version')) {
    return `${context.versionCount} version(s) are in mock history. Approving creates a new FY26 draft version entry with notes; older approved runs become archived/superseded in the demo narrative.`;
  }

  if (q.includes('live') || q.includes('real model') || q.includes('backend')) {
    return 'This is a static frontend prototype. Figures are simulated/precomputed. No backend, database, or live model training is called. The assistant is a TypeScript mock service you can later swap for an LLM API.';
  }

  if (q.includes('preview') || q.includes('locked')) {
    return `Current stage "${context.stageLabel}" status is ${context.stageStatus}. Locked stages remain viewable in preview; banners explain missing prerequisites.`;
  }

  // Default grounded fallback
  return `You're on ${context.stageLabel} (${context.stageStatus}). ${context.insights[0] ?? 'Ask about quality issues, model choice, WAPE, under-forecasting, templates, or overrides.'}\n\nTry a suggested prompt for this stage, or ask specifically about transformations, XGBoost, bias, or template missing-delta.`;
}

export class MockAssistantService implements AssistantService {
  brief(context: AssistantContext): AssistantStageBrief {
    return briefFor(context);
  }

  suggestPrompts(context: AssistantContext): AssistantPrompt[] {
    return stagePrompts(context.stageId);
  }

  async ask(question: string, context: AssistantContext): Promise<AssistantReply> {
    await delay(220 + Math.floor(Math.random() * 180));
    return {
      answer: matchAnswer(question.trim() || 'help', context),
      relatedPrompts: stagePrompts(context.stageId).slice(0, 3),
    };
  }
}

/** Single export — replace this instance with an LLM-backed service later. */
export const assistantService: AssistantService = new MockAssistantService();
