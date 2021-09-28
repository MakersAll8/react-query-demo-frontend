import {useQuery, useQueryClient} from 'react-query';
import { getCityApi } from '../api';

export const useCity = ({id})=> {
  const queryClient = useQueryClient();
  const { isLoading, error, data: city, ...rest } = useQuery(['city', id], async ()=>{
    await new Promise(resolve => setTimeout(resolve, 1000))
    return getCityApi({id});
  }, 
  {
    refetchOnWindowFocus: false,
    initialData: ()=>queryClient.getQueryData(['post', id]),
    initialStale: true
  }
  // {
  //   initialData: () => queryClient.getQueryData('cities')?.find(c=>c.id===id), // polling mentality
  //   initialStale: true
  // }
  );
  return {isLoading, error, city, ...rest}
}