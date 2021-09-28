import {useQuery, useMutation, useQueryClient} from 'react-query';
import { getCitiesApi, updateCityApi } from '../api';

export const useCities = ()=> {
  const queryClient = useQueryClient();
  const { isLoading, error, data: cities, ...rest } = useQuery('cities', async ()=>{
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

  const mutation = useMutation(updateCityApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        ['cities'], 
        // {
        //   refetchActive: false, // default true, don't automatically fetch when query is stale
        //   refetchInactive: true, // default false, fetch from server even no component is mounted, rendering the query
        // }
      );
    }
  });
  const updateCity = ({id, city, province, country, zip})=>{
    mutation.mutate({
      id, city, province, country, zip
    })
  };
  return {isLoading, error, cities, updateCity, ...rest}
}