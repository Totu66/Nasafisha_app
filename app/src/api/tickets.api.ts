import httpClient from './http';

export const ticketsApi = {
  async list() {
    const res = await httpClient.get('/tickets');
    return res.data;
  },
  async get(id) {
    const res = await httpClient.get(`/tickets/${id}`);
    return res.data;
  },
};

export default ticketsApi;

