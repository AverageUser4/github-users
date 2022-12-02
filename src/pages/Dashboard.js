import React, { useEffect, useState } from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router-dom';

import Loading from '../components/Loading';


const initialProfileData = {
  user: null,
  followers: null,
  repos: null
};

const initialRateLimit = {
  limit: 0,
  remaining: 0
}

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isFetching, setIsFetching] = useState(false);
  const [rateLimit, setRateLimit] = useState(initialRateLimit);

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
    let ignore = false;

    async function fetchUserData() {
      try {
        setIsFetching(true);
        setProfileData(initialProfileData);
        setError('');

        const user = await fetch(`https://api.github.com/users/${query}`);
        const userJSON = await user.json();

        if(userJSON.message)
          throw new Error(userJSON.message);

        const followers = await fetch(`https://api.github.com/users/${query}/followers`);
        const repos = await fetch(`https://api.github.com/users/${query}/repos?per_page=100&sort=updated`);

        const followersJSON = await followers.json();
        const reposJSON = await repos.json();

        if(ignore)
          return;

        setProfileData({
          user: userJSON,
          followers: followersJSON,
          repos: reposJSON
        });

      } catch(error) {
        console.error(error);
        setError(error?.toString());
      } finally {
        setIsFetching(false);

        try {
        // limit may alternatively be read from x-ratelimit-limit, x-ratelimit-remaining headers
        // of the latest Response object in repos (date header may be used to get the latest one)
        // note that the ratelimit wont get updated if fetch fails with current implementation
        const rateLimit = await fetch('https://api.github.com/rate_limit');
        const rateLimitJSON = await rateLimit.json();
        const { limit, remaining } = rateLimitJSON.resources.core;

        setRateLimit({
          limit: limit || 0, 
          remaining: remaining || 0
        });

        } catch(error) {
          console.error(error);
        }
      }
    }

    if(query)
      fetchUserData();
    
    return () => ignore = true;
  }, [query]);

  useEffect(() => {
    let ignore = false;

    (async function fetchRateLimit() {
      try {
        const rateLimit = await fetch('https://api.github.com/rate_limit');
        const rateLimitJSON = await rateLimit.json();
        const { limit, remaining } = rateLimitJSON.resources.core;
  
        if(ignore)
          return;

        setRateLimit({
          limit: limit || 0, 
          remaining: remaining || 0
        });

      } catch(error) {
        console.error(error);
      }
    })()

    return () => ignore = true;
  }, []);

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
        rateLimit={rateLimit}
      />

      {
        isFetching ? 
          <Loading/>
        :
          <>
            <Info
              user={profileData.user}
            />
            <User
              user={profileData.user}
              followers={profileData.followers}
            />
            <Repos
              repos={profileData.repos}      
            />
          </>
      }

    </main>
  );
};

export default Dashboard;