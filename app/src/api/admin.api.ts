import httpClient from './http';

export const adminApi = {
  async getDashboard() {
    const res = await httpClient.get('/dashboard');
    return res.data;
  },
  async getAuditLogs() {
    const res = await httpClient.get('/auditLogs');
    return res.data;
  },
};

export default adminApi;
