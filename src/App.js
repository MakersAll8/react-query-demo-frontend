import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {QueryClientProvider, QueryClient} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import { CitiesPage, PaginatedCitiesPage } from "./components/CitiesPage/CitiesPage";
import { ErrorPage } from "./components/ErrorPage/ErrorPage";
import 'antd/dist/antd.css';
import React, { useEffect } from "react";
import { getCitiesApi } from "./api";

const queryClient = new QueryClient();

function App() {
  // If I don't want cities to load when I click on cities link from landing page, I can prefetch
  // request will fire again when CitiesPage is mounted
  useEffect(()=>{
    queryClient.prefetchQuery('cities', getCitiesApi)
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
        <Router>
          <div>
            <nav>
              <ul>
                {/* you can prefetch on hover */}
                {/*
                <li onMouseEnter={()=>{
                  queryClient.prefetchQuery('key', fetchFunction, {
                    staleTime: Infinity
                  })
                }}> */}
                <li>
                  <Link to="/error">Error Page</Link>
                </li>
                <li>
                  <Link to="/cities">Cities Page</Link>
                </li>
                <li>
                  <Link to="/paginated_cities">Paginated Cities Page</Link>
                </li>
              </ul>
            </nav>

            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/error">
                <ErrorPage />
              </Route>
              <Route path="/cities">
                <CitiesPage />
              </Route>
              <Route path="/paginated_cities">
                <PaginatedCitiesPage />
              </Route>
            </Switch>
          </div>
        </Router>
        <ReactQueryDevtools/>
    </QueryClientProvider>
  )
}

export default App;
