import React from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import loadingImage from '../images/preloader.gif';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router-dom';

import mockRepos from '../assets/mockData/mockRepos.js';
import mockUser from '../assets/mockData/mockUser.js';
import mockFollowers from '../assets/mockData/mockFollowers.js';


const rootUrl = 'https://api.github.com';

const Dashboard = () => {
  const [query, setQuery] = React.useState('');

  return (
    <main>

      <Navbar/>
      <Search
        setQuery={setQuery}
      />
      <Info
        user={mockUser}
      />
      <User
        user={mockUser}
        followers={mockFollowers}
      />
      <Repos
        repos={mockRepos}      
      />

    </main>
  );
};

export default Dashboard;
