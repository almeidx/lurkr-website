import React, { FC } from 'react';
import {
  BrowserRouter, Redirect, Route, Switch,
} from 'react-router-dom';

import Layout from './components/Layout';
import Leaderboard from './components/Leaderboard';

const Router: FC = () => (
  <BrowserRouter>
    <Switch>
      <Route component={Layout} path='/' exact />
      <Route component={Leaderboard} path='/leaderboard' />
      <Redirect to='/' />
    </Switch>
  </BrowserRouter>
);

export default Router;
