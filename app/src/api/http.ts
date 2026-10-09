<<<<<<< HEAD
export {};
=======
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const httpClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default httpClient;
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
