import React, { useState } from 'react';
import { Profile, Search, Navbar, Loading } from '../components';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect, useLocation, useHistory } from 'react-router-dom';

const initialRateLimit = {
  limit: 0,
  remaining: 0
};

const Dashboard = () => {
  const { search } = useLocation();
  const usp = new URLSearchParams(search);
  const query = usp.get('user') || '';
  const { push } = useHistory();
  
  const { isAuthenticated, isLoading } = useAuth0();
  const [error, setError] = useState('');
  const [rateLimit, setRateLimit] = useState(initialRateLimit);

  function setQuery(query) {
    push(`/dashboard?user=${query}`);
  }
  
  if(isLoading)
    return <Loading/>

  if(!isAuthenticated)
    return <Redirect to="/login"/>

  return (
    <main>

      <Navbar/>

      <Search
        setQuery={setQuery}
        query={query}
        error={error}
        rateLimit={rateLimit}
      />

      <Profile
        query={query}
        setQuery={setQuery}
        setError={setError}
        setRateLimit={setRateLimit}
      />

    </main>
  );
};

export default Dashboard;