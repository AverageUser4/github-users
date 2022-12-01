import React, { useEffect, useState } from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router-dom';

import mockRepos from '../assets/mockData/mockRepos.js';
import mockUser from '../assets/mockData/mockUser.js';
import mockFollowers from '../assets/mockData/mockFollowers.js';
import Loading from '../components/Loading';


const rootUrl = 'https://api.github.com';

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({});
  const [isFetching, setIsFetching] = useState();

  useEffect(() => {
    /*
      - start fetching userData: `https://api.github.com/users/${query}`
      - start fetching user's followers: `https://api.github.com/users/${query}/followers` (up to 30 objects)

      - throw if either of those returns object with message property (it's empty array if there are no followers)

      - get public_repos from userData then fetch all pages of repos: `https://api.github.com/users/${query}/repos?per_page=100`

      - after all fetches are done: 'https://api.github.com/rate_limit', alternatively read x-ratelimit-remaining and x-ratelimit
        headers after every fetch and update state ({ remaining: ..., limit: ..., checkedTime: ... }) 
        if it was the latest fetch (not sure if this check is necessary)

      ideally render some components while others have loading animation inside them
    */
    const ignore = false;

    async function fetchUserData() {
      try {
        setIsFetching(true);

        const userData = await fetch(`https://api.github.com/users/${query}`);
        const userJSON = await userData.json();

        if(userJSON.message)
          throw new Error(userJSON.message);

        if(ignore)
          return;

      } catch(error) {
        console.error(error);
        setError(error?.toString());
      } finally {
        setIsFetching(false);
      }
    }

    if(query && !isFetching)
      fetchUserData();
    
    return () => ignore = true;
  }, [query, isFetching]);

  if(isLoading)
    return <Loading/>

  if(!isAuthenticated)
    return <Redirect to="/login"/>

  return (
    <main>

      <Navbar/>
      <Search
        setQuery={setQuery}
        error={error}
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