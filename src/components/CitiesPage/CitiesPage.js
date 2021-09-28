import React, { useEffect } from "react"
import {useRouteMatch, Route, Link, useParams} from 'react-router-dom';
import { useCities } from "../../hooks/useCities";
import {Form, Input, Button} from 'antd';
import { useCity } from "../../hooks/useCity";

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
        <nav>
          <ul>
            {citiesNav}
          </ul>
        </nav>
        <Route path={`${match.path}/:cityId`}>
          <City/>
        </Route>
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