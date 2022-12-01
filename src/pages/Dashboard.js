import React from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import loadingImage from '../images/preloader.gif';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router-dom';

const rootUrl = 'https://api.github.com';

const Dashboard = () => {
  const [query, setQuery] = React.useState('');

  return (
    <main>

      <Navbar/>
      <Search
        setQuery={setQuery}
      />
      <Info/>
      <User/>
      <Repos/>

    </main>
  );
};

export default Dashboard;
