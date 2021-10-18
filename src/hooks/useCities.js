import {useQuery, useMutation, useQueryClient} from 'react-query';
import { useHistory } from 'react-router-dom';
import { getCitiesApi, updateCityApi, createCityApi } from '../api';

export const useCities = ()=> {
  const history = useHistory();
  const queryClient = useQueryClient();

  const { isLoading, error, data: cities, ...rest } = useQuery('cities', async ()=>{
    await new Promise(resolve => setTimeout(resolve, 1000))
    const posts = await getCitiesApi();
    posts.forEach(post=>{
      queryClient.setQueryData(['post', post.id], post) // push mentality to cache
    });
    return posts;
  }, {
    refetchOnWindowFocus: false,
    cacheTime: 60000
    // staleTime: 5000,
    // staleTime: Infinity,
    // enabled: bool,
    // retry: number, // default is 3, retryDelay uses exponential backup
    // initialData: [{}], // for optimistic rendering. response will update this object, need to set stale
    // initialStale: true,
    // onSuccess: (data)=>{},
    // onError: (error)=>{},
    // onSettled: (data, error)=>{},
    // refetchInterval: 5000,
    // refetchIntervalInBackground: true // with only refetchInterval, if you go to another tab, it won't fetch
  });

  const updateMutation = useMutation(updateCityApi, {
    onMutate: values => {
      queryClient.cancelQueries(['city', String(values.id)]);
      const oldCity = queryClient.getQueryData(['city', String(values.id)]);
      const oldCities = queryClient.getQueryData('cities');
      // update cities cache
      queryClient.setQueryData('cities', _oldCities => {
        const index = _oldCities.findIndex(c=> c.id === values.id);
        const oldCitiesClone = _oldCities.slice();
        oldCitiesClone[index] = values;
        return oldCitiesClone;
      });
      queryClient.setQueryData(['city', String(values.id)], values);

      return ()=> {
        queryClient.setQueryData(['city', String(values.id)], oldCity);
        queryClient.setQueryData('cities', oldCities);
      }
    },
    onSuccess: (data, values) => {
      // data is the response data, and values is the parameters used to call updateCityApi
      // why waste another api request
      // queryClient.invalidateQueries(['city', String(values.id)])
      queryClient.setQueryData(['city', String(values.id)], data);
      queryClient.setQueryData('cities', _oldCities => {
        const index = _oldCities.findIndex(c=> c.id === values.id);
        const oldCitiesClone = _oldCities.slice();
        oldCitiesClone[index] = data;
        return oldCitiesClone;
      });
    },
    onError: (error, values, rollback)=>{
      rollback && rollback();
    },
    // onSettled: (data, error, values)=>{
      // queryClient.invalidateQueries(
      //   ['cities'], 
        // {
        //   refetchActive: false, // default true, don't automatically fetch when query is stale
        //   refetchInactive: true, // default false, fetch from server even no component is mounted, rendering the query
        // }
      // );
    // }
  });
  const updateCity = ({id, city, province, country, zip})=>{
    updateMutation.mutate({
      id, city, province, country, zip
    })
  };

  const createMutation = useMutation(createCityApi, {
    onMutate: (values)=>{
      // make sure no outgoing cities query is happening while doing onMutate
      // very rare race condition could happen without this
      // always cancelQueries before optimistically update
      queryClient.cancelQueries('cities');

      const oldData = queryClient.getQueryData('cities');
      queryClient.setQueryData('cities', oldCities=> {
        return [{...values, id: Date.now()}, ...oldCities]
      })
      return () => queryClient.setQueryData('cities', oldData); // what is returned here becomes the third param of onError
    },
    onSuccess: (data, values) => {
      queryClient.setQueryData(['city', String(data.id)], data);
      queryClient.setQueryData('cities', oldCities =>{
        return [data, ...oldCities.slice(1)]
      });
      history.push(`/cities/${data.id}`);
      // queryClient.invalidateQueries(
      //   ['cities']
      // );
    },
    onError: (error, values, rollback)=>{
      if(rollback){
        rollback();
      }
    }
  });
  const createCity = ({city, province, country, zip})=>{
    createMutation.mutate({
      city, province, country, zip
    })
  }

  return {isLoading, error, cities, updateCity, createCity, ...rest}
}