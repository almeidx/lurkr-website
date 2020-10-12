import React from 'react';
import { useHistory } from 'react-router-dom';

interface RedirectProps {
  url: string;
}

const Leaderboard: React.FC<RedirectProps> = ({ url }) => {
  window.open(url);

  const history = useHistory();
  history.push('/');

  return <div />;
};

export default Leaderboard;
