import React from 'react';
import { useHistory } from 'react-router-dom';

const Leaderboard: React.FC = () => {
  window.open('https://arcanebot.xyz/leaderboard/pepeemoji');

  const history = useHistory();
  history.push('/');

  return <div />;
};

export default Leaderboard;
