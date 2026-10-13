import httpClient from './http';
import type { Report, CreateReportPayload } from '../types/report';

export const reportsApi = {
  async list(): Promise<Report[]> {
    const res = await httpClient.get('/reports');
    return res.data;
  },

  async get(id: string | number): Promise<Report> {
    const res = await httpClient.get(`/reports/${id}`);
    return res.data;
  },

  async create(payload: CreateReportPayload): Promise<Report> {
    const res = await httpClient.post('/reports', payload);
    return res.data;
  },
};

export default reportsApi;
