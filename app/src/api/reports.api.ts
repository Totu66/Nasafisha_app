import httpClient from './http';

export const reportsApi = {
  async list() {
    const res = await httpClient.get('/reports');
    return res.data;
  },
  async get(id) {
    const res = await httpClient.get(`/reports/${id}`);
    return res.data;
  },
};

export default reportsApi;

