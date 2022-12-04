import React, { useState } from 'react';
import { Profile, Search, Navbar, Loading } from '../components';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router-dom';

const initialRateLimit = {
  limit: 0,
  remaining: 0
};

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [query, setQuery] = useState('john-smilga');
  const [error, setError] = useState('');
  const [rateLimit, setRateLimit] = useState(initialRateLimit);

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