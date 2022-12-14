import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Followers = ({ followers, allFollowersCount, advanceFollowersPage, setQuery }) => {  
  if(!followers || !followers.length)
    return (
      <Wrapper>
        <div className="followers">
          No followers found.
        </div>
      </Wrapper>
    );

  const hasMoreFollowers = followers.length < allFollowersCount;

  function handleScroll(event) {
    const { target } = event;
    const { scrollTop, scrollTopMax } = target;

    if(scrollTop < scrollTopMax || !hasMoreFollowers)
      return;

    advanceFollowersPage();
  }
    
  return (
    <Wrapper>
      <div 
        className="followers"
        onScroll={(e) => hasMoreFollowers ? handleScroll(e) : ()=>0}
      >
        {
          followers.map(follower => 
            <article
              key={follower.id}
            >
              <img
                src={follower.avatar_url} 
                alt={follower.login}
                onClick={() => setQuery(follower.login)}
              />
              <div>
                <h4 onClick={() => setQuery(follower.login)}>{follower.login}</h4>
                <a href={follower.html_url}>{follower.html_url}</a>
              </div>
            </article>
          )
        }
      </div>
    </Wrapper>
  )
};

Followers.propTypes = {
  followers: PropTypes.array,
  allFollowersCount: PropTypes.number,
  advanceFollowersPage: PropTypes.func,
  setQuery: PropTypes.func,
};

const Wrapper = styled.article`
  background: var(--clr-white);
  border-top-right-radius: var(--radius);
  border-bottom-left-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
  position: relative;

  &::before {
    content: ' followers';
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-100%);
    background: var(--clr-white);
    color: var(--clr-grey-5);
    border-top-right-radius: var(--radius);
    border-top-left-radius: var(--radius);
    text-transform: capitalize;
    padding: 0.5rem 1rem 0 1rem;
    letter-spacing: var(--spacing);
    font-size: 1rem;
  }
  .followers {
    overflow: scroll;
    max-height: 260px;
    display: grid;
    grid-auto-rows: 45px;
    gap: 1.25rem 1rem;
    padding: 1rem 2rem;
  }
  article {
    transition: var(--transition);
    padding: 0.15rem 0.5rem;
    border-radius: var(--radius);
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: 1rem;
    img {
      height: 100%;
      width: 45px;
      border-radius: 50%;
      object-fit: cover;
      :hover {
        cursor: pointer;
      }
    }
    h4 {
      margin-bottom: 0;
      :hover {
        cursor: pointer;
      }
    }
    a {
      color: var(--clr-grey-5);
    }
  }
`;
export default Followers;
