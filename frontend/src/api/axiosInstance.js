import axios from 'axios'

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

API.interceptors.request.use((config)=>{
  const token = localStorage.getItem('accessToken');
  if(token){
    config.headers.Authorization = 'Bearer ${token}'
  }
  return config;
})

API.interceptors.response.use(
  (response) => response,
  async (error)=> {
    const originalRequest = error.config;
    if(error.response?.status === 401 && !originalRequest._retry){
      originalRequest._retry = true;
      try{
        const res= await API.post('/auth/refresh-token');
        const {accessToken} = res.data;

        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = 'Bearer ${accessToken}';

        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        window.location.href = '/login';
        return Promise.reject(refreshError);

      }
    }
    return Promise.reject(error);
  }
); 

export default API