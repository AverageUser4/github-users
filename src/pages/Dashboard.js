import React, { useEffect, useState } from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router-dom';

import Loading from '../components/Loading';


const initialProfileData = {
  user: null,
  followers: null,
  repos: null,
  followersPage: 1
};

const initialRateLimit = {
  limit: 0,
  remaining: 0
}

const FOLLOWERS_PER_PAGE = 30;

function getRateLimit(arrayOfHeaders) {
  console.log(arrayOfHeaders)
  let limit = Number(arrayOfHeaders[0].get('x-ratelimit-limit'));
  let remaining = Number.MAX_SAFE_INTEGER;

  for(let header of arrayOfHeaders)
    remaining = Math.min(Number(header.get('x-ratelimit-remaining')), remaining);

  return {
    limit: limit || 0,
    remaining: remaining || 0
  };
}

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [query, setQuery] = useState('john-smilga');
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isFetching, setIsFetching] = useState(false);
  const [rateLimit, setRateLimit] = useState(initialRateLimit);

  useEffect(() => {
    let ignore = false;

    async function fetchUserData() {
      try {
        setIsFetching(true);
        setProfileData(initialProfileData);
        setError('');

        const data = await Promise.all([
          fetch(`https://api.github.com/users/${query}`),
          fetch(`https://api.github.com/users/${query}/followers`),
          fetch(`https://api.github.com/users/${query}/repos?per_page=100&sort=updated`),
        ]);
 
        const dataJSON = await Promise.all(data.map(item => item.json()));
        const [userJSON, followersJSON, reposJSON] = dataJSON;
        
        if(userJSON.message)
          throw new Error(userJSON.message);

        if(ignore)
          return;

        setRateLimit(getRateLimit(data.map(item => item.headers)));

        setProfileData(prev => ({
          user: userJSON,
          followers: followersJSON,
          repos: reposJSON,
          followersPage: 1
        }));

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

  useEffect(() => {
    let ignore = false;

    async function fetchMoreFollowers() {
      try {
        // currently a couple of request may happen at once which is problematic
        const followers = fetch(`https://api.github.com/users/${query}/followers?page=${profileData.followersPage}`);
        const followersJSON = await (await followers).json();

        // data in fetch above is array of Response object, but followers here is Promise object

        if(ignore)
          return;

        if(!followersJSON[0])
          throw new Error(`API returned empty array when fetching new followers.
          This likely means that the 'page' query parameter of request is bigger than expected.
          Please make sure the App only tries to fetch as many pages as there are. 
          Number of followers can be accessed in user data. There are 30 followers per page by default`);
        if(followersJSON.message)
          throw new Error(followersJSON.message);


        setProfileData(prev => ({
          ...prev,
          followers: [...prev.followers, ...followersJSON]
        }));

        const aoh = [followers.headers];
        console.log(aoh, followers)
        setRateLimit(getRateLimit(aoh));

      } catch(error) {
        console.error(error);
      }
    }

    if(profileData.followersPage > 1)
      fetchMoreFollowers();

    return () => ignore = true;
  }, [profileData.followersPage]);

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

  function advanceFollowersPage() {
    const maxPage = Math.ceil(profileData.user.followers / FOLLOWERS_PER_PAGE);
    if(profileData.followersPage + 1 <= maxPage)
      setProfileData(prev => ({ ...prev, followersPage: prev.followersPage + 1 }));
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
              advanceFollowersPage={advanceFollowersPage}
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