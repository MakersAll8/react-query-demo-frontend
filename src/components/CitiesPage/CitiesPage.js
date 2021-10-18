import React, { useEffect, useState } from "react"
import {useRouteMatch, Route, Link, useParams} from 'react-router-dom';
import { useCities } from "../../hooks/useCities";
import {Form, Input, Button} from 'antd';
import { useCity } from "../../hooks/useCity";
import { usePaginatedCities } from "../../hooks/usePaginatedCities";
import { useInfiniteQuery } from "react-query";
import axios from "../../axios";

export const CitiesPage = ()=>{
  let match = useRouteMatch();
  const {cities, isLoading, isError, error} = useCities(); 

  if(isLoading){
    return <div>Loading...</div>
  }

  if(isError){
    return <div>{error.message}</div>
  }

  const citiesNav = cities.map(city=>(
    <li key={city.id}>
      <Link to={`/cities/${city.id}`}>City: {city.city} Province: {city.province}</Link>
    </li>
  ));
  return (
    <>
      <h1>Cities Page</h1>
      <div style={{display: 'flex'}}>
        <div>
          <nav>
            <ul>
              {citiesNav}
            </ul>
          </nav>
        </div>
        <Route path={`${match.path}/:cityId`}>
          <City/>
        </Route>
        <AddCity/>
      </div>
    </>
  )
}

export const PaginatedCitiesPage = ()=>{
  let match = useRouteMatch();
  const [page, setPage] = useState(1);
  const {cities, isLoading, isError, error} = usePaginatedCities({page, size: '10'});

  const onPrevious = () => {
    setPage(prev=> prev -1);
  }

  const onNext = () => {
    setPage(prev=>prev+1);
  }

  if(isLoading){
    return <div>Loading...</div>
  }

  if(isError){
    return <div>{error.message}</div>
  }

  const citiesNav = cities.map(city=>(
    <li key={city.id}>
      <Link to={`/paginated_cities/${city.id}`}>City: {city.city} Province: {city.province}</Link>
    </li>
  ));
  return (
    <>
      <h1>Paginated Cities Page</h1>
      <div style={{display: 'flex'}}>
        <div>
          <nav>
            <ul>
              {citiesNav}
            </ul>
          </nav>
          <span>Current Page: {page} {isLoading ? '...' : null}</span>
          <Button onClick={onPrevious}>Previous</Button>
          <Button onClick={onNext}>Next</Button>
        </div>
        <Route path={`${match.path}/:cityId`}>
          <City/>
        </Route>
        <AddCity/>
      </div>
    </>
  )
}

export const InfiniteCitiesPage = ()=>{
  let match = useRouteMatch();
  const {
    status,
    data: cities,
    error,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore
  } = useInfiniteQuery(
    "infiniteCities",
    async (key, nextPage = 0) => {
      const { data } = await axios.get(
        "/cities/25/" +
          nextPage * 25
      );
      return data;
    },
    {
      getFetchMore: (lastGroup, groups) =>
        lastGroup.length ? groups.length : false
    }
  );

  if(isFetching){
    return <div>Loading...</div>
  }

  if(error){
    return <div>{error.message}</div>
  }

  const citiesNav = cities.map(city=>(
    <li key={city.id}>
      <Link to={`/infinite_cities/${city.id}`}>City: {city.city} Province: {city.province}</Link>
    </li>
  ));
  return (
    <>
      <h1>Paginated Cities Page</h1>
      <div style={{display: 'flex'}}>
        <div>
          <nav>
            <ul>
              {citiesNav}
            </ul>
          </nav>
        </div>
        <Route path={`${match.path}/:cityId`}>
          <City/>
        </Route>
        <AddCity/>
      </div>
    </>
  )
}

export const City = ()=>{
  const {cityId} = useParams();
  const {updateCity} = useCities();
  const {city} = useCity({id: cityId});

  const [form] = Form.useForm();
  useEffect(()=>{
    form.setFieldsValue({...city});
  }, [city, form]);

  const onFinish = (values)=>{
    updateCity({id: cityId, ...values})
  }

  if(!city) return null;  
  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="city" label="City">
          <Input />
        </Form.Item>
        <Form.Item name="province" label="Province">
          <Input />
        </Form.Item>
        <Form.Item name="country" label="Country">
          <Input />
        </Form.Item>
        <Form.Item name="zip" label="Zip">
          <Input />
        </Form.Item>

        <Form.Item label="Update">
          <Button type="primary" htmlType="submit">Update City</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export const AddCity = ()=>{
  const {createCity} = useCities();

  const [form] = Form.useForm();

  const onFinish = (values)=>{
    createCity({...values})
  }

  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="city" label="City">
          <Input />
        </Form.Item>
        <Form.Item name="province" label="Province">
          <Input />
        </Form.Item>
        <Form.Item name="country" label="Country">
          <Input />
        </Form.Item>
        <Form.Item name="zip" label="Zip">
          <Input />
        </Form.Item>

        <Form.Item label="Create">
          <Button type="secondary" htmlType="submit">Create City</Button>
        </Form.Item>
      </Form>
    </div>
  )
}