import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {QueryClientProvider, QueryClient} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import { CitiesPage } from "./components/CitiesPage/CitiesPage";
import { ErrorPage } from "./components/ErrorPage/ErrorPage";
import 'antd/dist/antd.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/error">Error Page</Link>
                </li>
                <li>
                  <Link to="/cities">Cities Page</Link>
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
            </Switch>
          </div>
        </Router>
        <ReactQueryDevtools/>
    </QueryClientProvider>
  )
}

export default App;
