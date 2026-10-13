export type IncidentSeverity = 'low' | 'medium' | 'high' | 'urgent';

export interface Incident {
  id: string | number;
  type: string;
  severity: IncidentSeverity;
  location: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  reportedAt: string;
  resolvedAt?: string;
}
