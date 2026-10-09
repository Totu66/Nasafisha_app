<<<<<<< HEAD
export {};
=======
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

>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
