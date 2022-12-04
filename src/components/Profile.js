import React, { useEffect, useState } from 'react';
import { Info, Repos, User } from '../components';
import PropTypes from 'prop-types';

import Loading from '../components/Loading';

const FOLLOWERS_PER_PAGE = 30;

const initialProfileData = {
  user: null,
  followers: null,
  repos: null,
  followersPage: 1
};

function Profile({ query, setQuery, setError, setRateLimit }) {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingNewFollowers, setIsFetchingNewFollowers] = useState(false);

  useUser({ setIsFetching, setProfileData, setError, query, setRateLimit });
  useMoreFollowers({ setIsFetchingNewFollowers, setProfileData, profileData, query });
  useRateLimit({ setRateLimit, profileData });

  function advanceFollowersPage() {
    if(isFetchingNewFollowers)
      return;
    const maxPage = Math.ceil(profileData.user.followers / FOLLOWERS_PER_PAGE);
    if(profileData.followersPage + 1 <= maxPage)
      setProfileData(prev => ({ ...prev, followersPage: prev.followersPage + 1 }));
  }

  return (
    <>
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
              setQuery={setQuery}
            />
            <Repos
              repos={profileData.repos}      
            />
          </>
      }
    </>
  );

}

Profile.propTypes = {
  query: PropTypes.string,
  setError: PropTypes.func,
  setRateLimit: PropTypes.func,
  setQuery: PropTypes.func
};

function useUser({ setIsFetching, setProfileData, setError, query, setRateLimit }) {
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

        setProfileData({
          user: userJSON,
          followers: followersJSON,
          repos: reposJSON,
          followersPage: 1
        });

      } catch(error) {
        console.error(error);
        setError(error.toString());
      } finally {
        setIsFetching(false);
      }
    }

    if(query)
      fetchUserData();
    
    return () => ignore = true;
  }, [query, setError, setRateLimit, setIsFetching, setProfileData]);
}

function useMoreFollowers({ setIsFetchingNewFollowers, setProfileData, profileData, query }) {
  useEffect(() => {
    let ignore = false;

    async function fetchMoreFollowers() {
      try {
        setIsFetchingNewFollowers(true);

        const followers = fetch(`https://api.github.com/users/${query}/followers?page=${profileData.followersPage}`);
        const followersJSON = await (await followers).json();

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
            followers: [...prev.followers, ...followersJSON],
          }));

      } catch(error) {
        console.error(error);
      } finally {
        setIsFetchingNewFollowers(false);
      }
    }

    if(profileData.followersPage > 1)
      fetchMoreFollowers();

    return () => ignore = true;
  }, [profileData.followersPage, query, setIsFetchingNewFollowers, setProfileData]);
}

function useRateLimit({ setRateLimit, profileData }) {
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
  }, [profileData, setRateLimit]);
}

export default Profile;