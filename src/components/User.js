import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Card from './Card';
import Followers from './Followers';


const User = ({ user, followers }) => {
  if(!user && !followers)
    return null;

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Card user={user}/>
        <Followers followers={followers}/>
      </Wrapper>
    </section>
  );
};

User.propTypes = {
  user: PropTypes.object,
  followers: PropTypes.array
}

const Wrapper = styled.div`
  padding-top: 2rem;
  display: grid;
  gap: 3rem 2rem;
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
  /* align-items: start; */
`;

export default User;
