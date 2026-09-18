import type { DataQualityIssue } from '../types/app';

export const dataQualityIssues: DataQualityIssue[] = [
  { id: 'dq1', title: 'Missing sales values', description: 'Null values occur in the 2024 holiday period.', severity: 'high', affectedRows: 418, evidence: '0.12% nulls concentrated in weeks 47–49', suggested: 'Impute using SKU weekly median.' },
  { id: 'dq2', title: 'Duplicate transactions', description: 'Rows share order, SKU and timestamp keys.', severity: 'medium', affectedRows: 126, evidence: '63 duplicate key pairs', suggested: 'Keep the most recently updated row.' },
  { id: 'dq3', title: 'Negative quantities', description: 'Likely returns are mixed with gross sales.', severity: 'medium', affectedRows: 291, evidence: 'Values range from -1 to -42 units', suggested: 'Classify as returns and net by week.' },
  { id: 'dq4', title: 'Region label drift', description: 'West appears under three spellings.', severity: 'low', affectedRows: 1842, evidence: 'West, WEST and W region labels', suggested: 'Normalize to West.' },
  { id: 'dq5', title: 'Extreme sales spikes', description: 'Large deviations may be promotions.', severity: 'high', affectedRows: 37, evidence: 'Above 6× rolling median', suggested: 'Winsorize only unconfirmed events.' },
  { id: 'dq6', title: 'Incomplete recent week', description: 'Latest week contains four reporting days.', severity: 'critical', affectedRows: 3120, evidence: '57% of expected weekly volume', suggested: 'Exclude latest week from training.' },
];
