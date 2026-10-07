import httpClient from './http';

export const authApi = {
  async login(payload: { email: string; password: string; role: 'admin' | 'citizen' | 'field'; }) {
    const res = await httpClient.post('/login', payload);
    return res.data;
  },

  async me() {
    const res = await httpClient.get('/me');
    return res.data;
  },
};

export default authApi;
