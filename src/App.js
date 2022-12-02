import React from 'react';
import { Dashboard, Login, Error } from './pages';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from './components/Loading';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if(isLoading)
    return (
      <Loading/>
    );

  return (
    <Router>

      <Switch>

        <Redirect exact from="/" to={isAuthenticated ? '/dashboard' : '/login'}/>
        {
          isAuthenticated ? 
            <Redirect from="/login" to="/dashboard"/>
          :
            <Redirect from="/dashboard" to="/login"/>
        }

        <Route path="/dashboard">
          <Dashboard></Dashboard>
        </Route>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="*">
          <Error />
        </Route>

      </Switch>

    </Router>
  );
}

export default App;