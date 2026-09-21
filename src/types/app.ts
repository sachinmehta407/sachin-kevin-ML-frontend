import type { ForecastDashboardFilters } from './forecast';

export type Theme = 'light' | 'dark' | 'system';
export type StageStatus = 'locked' | 'ready' | 'in-progress' | 'complete';
export type IssueDecision = 'pending' | 'accept' | 'reject' | 'modify';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type UploadState = 'idle' | 'uploading' | 'complete' | 'error';
export type TrainingStatus = 'idle' | 'running' | 'complete' | 'failed';
export type ApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export type AppStageId =
  | 'overview' | 'ingestion' | 'quality' | 'standardization' | 'eda'
  | 'model-selection' | 'training' | 'dashboard' | 'segment-performance'
  | 'experiments' | 'ensemble' | 'overrides' | 'template-lab' | 'forecast-assembly'
  | 'template-compare' | 'approval' | 'versions';

export interface DemoFile {
  id: string;
  name: string;
  size: string;
  rows: number;
  period: string;
  status: 'validated' | 'warning';
}

export interface ColumnMapping {
  source: string;
  target: 'date' | 'sales' | 'sku' | 'product' | 'category' | 'region' | 'ignore';
  confidence: number;
}

export interface DataQualityIssue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  affectedRows: number;
  evidence: string;
  suggested: string;
}

export interface Transformation {
  id: string;
  name: string;
  field: string;
  rule: string;
  affectedRows: number;
  status: 'proposed' | 'applied';
}

export interface ModelCandidate {
  id: string;
  name: string;
  family: string;
  reason: string;
  estimate: string;
  selected?: boolean;
  excluded?: boolean;
}

export interface Experiment {
  id: string;
  name: string;
  models: string[];
  horizon: number;
  wape: number;
  bias: number;
  status: 'draft' | 'running' | 'complete';
  createdAt: string;
}

export interface EnsembleWeights {
  [model: string]: number;
}

export interface OverrideRow {
  id: string;
  sku: string;
  region: string;
  period: string;
  baseline: number;
  override: number;
  reason: string;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  models: string[];
  wape: number;
  bias: number;
  coverage: number;
}

export interface ForecastVersion {
  id: string;
  name: string;
  status: 'approved' | 'archived' | 'draft';
  createdAt: string;
  owner: string;
  wape: number;
  notes: string;
}

export interface ActivityItem {
  id: string;
  text: string;
  actor: string;
  time: string;
  tone: 'violet' | 'teal' | 'blue' | 'amber';
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  tone?: 'success' | 'info' | 'warning' | 'error';
}

export interface AssistantQuestion {
  question: string;
  answer: string;
}

export type DashboardFilters = ForecastDashboardFilters;
