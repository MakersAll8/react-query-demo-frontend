import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8890'
});

instance.interceptors.response.use(response =>{
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, error => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  error.intl = error.response.data;
  return Promise.reject(error);
})

export default instance;