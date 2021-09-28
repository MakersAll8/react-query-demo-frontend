import React, {useEffect} from 'react';
import { getError } from '../../api';

export const ErrorPage = ()=>{
  useEffect(()=>{
    (async ()=>{
      await getError()
    })()
  }, [])

  return (
    <div>
      <h1>Error Page</h1>
      see console
    </div>
  );
}