import React from 'react';
import styled from 'styled-components';
import { Column2D, Bar2D, Doughnut2D, Pie2D } from './Charts';
import PropTypes from 'prop-types';

function getReposChartDatas(repos) {
  let mostForked = repos.sort((a, b) => b.forks - a.forks).slice(0, 5);
  mostForked = mostForked.map(item => ({ label: item.name, value: item.forks }));
  
  let mostPopular = repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5);
  mostPopular = mostPopular.map(item => ({ label: item.name, value: item.stargazers_count }));

  const languages = {};
  for(let repo of repos) {
    if(!repo.language)
      continue;

    if(!languages[repo.language])
      languages[repo.language] = { count: 0, stars: 0 };

    languages[repo.language].count++;
    languages[repo.language].stars += repo.stargazers_count;
  }
  const languagesCount = [];
  const languagesStars = [];
  for(let key in languages) {
    languagesCount.push({ label: key, value: languages[key].count });
    languagesStars.push({ label: key, value: languages[key].stars });
  }

  return { mostPopular, mostForked, languagesCount, languagesStars };
}

const Repos = ({ repos }) => {
  if(!repos)
    return null;
    
  const { mostPopular, mostForked, languagesCount, languagesStars } =  getReposChartDatas(repos);

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie2D chartData={languagesCount}/>
        <Column2D chartData={mostForked}/>
        <Doughnut2D chartData={languagesStars}/>
        <Bar2D chartData={mostPopular}/>
      </Wrapper>
    </section>
  );
};

Repos.propTypes = {
  repos: PropTypes.array
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
