import type { ForecastVersion } from '../types/app';

export const forecastVersions: ForecastVersion[] = [
  { id: 'fy26-v1', name: 'FY26 V1', status: 'draft', createdAt: 'Sep 18, 2026', owner: 'Forecast Ops', wape: 10.9, notes: 'Candidate for Q4 operating plan.' },
  { id: 'fy25-v3', name: 'FY25 V3', status: 'approved', createdAt: 'Jun 28, 2026', owner: 'Maya Chen', wape: 12.6, notes: 'Production baseline.' },
  { id: 'fy25-v2', name: 'FY25 V2', status: 'archived', createdAt: 'Mar 31, 2026', owner: 'Maya Chen', wape: 13.4, notes: 'Superseded after promotion refresh.' },
];
