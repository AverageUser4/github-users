import React from 'react';
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from './pages';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if(isLoading)
    return (
      <h1>loading...</h1>
    )

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
