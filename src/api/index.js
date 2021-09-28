import axios from '../axios';
import {CancelToken} from 'axios';


export const getError = async ()=>{
  try {
    await axios.get('/error');
  } catch (e){
    // axios wraps response body in response.data
    // express is sending res.status(400).send({message:'errorMessage', error: [{a:'a', b:'b'}]});
    // const data = e.response.data
    // console.log({error: data.error, message: data.message}
    console.log(e.intl)
  }
}

export const getCitiesApi = async ()=>{
  // use CancelToken to dedupe api request
  // e.g. cancel duplicate request that comes from typing search field
  const source = CancelToken.source();
  const promise = axios.get('/cities', {
    cancelToken: source.token
  }).then(res => res.data);
  promise.cancel = () =>{
    source.cancel('Query was cancelled by react-query');
  }
  return promise;
}

export const getCityApi = async ({id})=>{
  // use CancelToken to dedupe api request
  // e.g. cancel duplicate request that comes from typing search field
  const source = CancelToken.source();
  const promise = axios.get(`/cities/${id}`, {
    cancelToken: source.token
  }).then(res => res.data);
  promise.cancel = () =>{
    source.cancel('Query was cancelled by react-query');
  }
  return promise;
}

export const updateCityApi = async ({id, city, province, country, zip}) => {
  const response = await axios.put('/cities', {id, city, province, country, zip});
  return response.data;
}