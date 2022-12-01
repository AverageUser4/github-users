import React, { useEffect, useState } from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router-dom';

import mockRepos from '../assets/mockData/mockRepos.js';
import mockUser from '../assets/mockData/mockUser.js';
import mockFollowers from '../assets/mockData/mockFollowers.js';
import Loading from '../components/Loading';


const initialProfileData = {
  user: {},
  followers: [],
  repos: []
};

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isFetching, setIsFetching] = useState(false);

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

        const user = fetch(`https://api.github.com/users/${query}`);
        const followers = fetch(`https://api.github.com/users/${query}/followers`);

        await user;
        await followers;

        const userJSON = await user.json();
        const followersJSON = await followers.json();

        if(ignore)
          return;

        if(userJSON.message)
          throw new Error(userJSON.message);

        const maxPage = Math.ceil(user.public_repos / 100);
        const repos = [];

        for(let i = 1; i <= maxPage; i++)
          repos.push(fetch(`https://api.github.com/users/${query}/repos?per_page=100&page=${i}`));
        for(let i = 1; i <= maxPage; i++)
          repos[i] = await repos[i];

        const reposJSON = [];

        for(let i = 1; i <= maxPage; i++)
          reposJSON[i] = await repos[i].json();

        const mergedReposJSON = [...reposJSON];

        if(ignore)
          return;

        console.log(userJSON, followersJSON, mergedReposJSON);

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