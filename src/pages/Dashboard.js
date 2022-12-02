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
        const followers = await fetch(`https://api.github.com/users/${query}/followers`);

        /* testing */
        // let user, followers;
        // if(query === 'john') {
        //   user = await fetch('http://localhost:80/react/public/mockData/mockUser.json');
        //   followers = await fetch('http://localhost:80/react/public/mockData/mockFollowers.json');
        // } else {
        //   user = await fetch('http://localhost:80/react/public/mockData/mockError.json');
        //   followers = await fetch('http://localhost:80/react/public/mockData/mockError.json');
        // }
        /* testing */

        const userJSON = await user.json();

        if(ignore)
          return;

        if(userJSON.message)
          throw new Error(userJSON.message);

        const maxPage = Math.ceil(userJSON.public_repos / 100);
        const repos = [];

        for(let i = 0; i < maxPage; i++) {
          repos.push(fetch(`https://api.github.com/users/${query}/repos?per_page=100&page=${i + 1}`));
          /* testing */
          // repos[i] = fetch(`http://localhost:80/react/public/mockData/mockRepos${i + 1}.json`);
        }
        for(let i = 0; i < maxPage; i++)
          repos[i] = await repos[i];

        const reposJSON = [];

        for(let i = 0; i < maxPage; i++)
          reposJSON[i] = await repos[i].json();

        const mergedReposJSON = reposJSON.flat();
        const followersJSON = await followers.json();

        // limit may alternatively be read from x-ratelimit-limit, x-ratelimit-remaining headers
        // of the latest Response object in repos (date header may be used to get the latest one)
        // note that the ratelimit wont get updated if fetch fails with current implementation
        const rateLimit = await fetch('https://api.github.com/rate_limit');
        const rateLimitJSON = await rateLimit.json();

        if(ignore)
          return;

        setProfileData({
          user: userJSON,
          followers: followersJSON,
          repos: mergedReposJSON
        });

        const { limit, remaining } = rateLimitJSON.resources.core;

        setRateLimit({
          limit: limit || 0, 
          remaining: remaining || 0
        });

      } catch(error) {
        console.error(error);
        setError(error?.toString());
      } finally {
        setIsFetching(false);
      }
    }

    if(query)
      fetchUserData();
    
    return () => ignore = true;
  }, [query]);

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

      {isFetching && <Loading/>}

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

    </main>
  );
};

export default Dashboard;