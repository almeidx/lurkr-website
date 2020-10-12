import React, { FC } from 'react';
import {
  BrowserRouter, Redirect, Route, Switch,
} from 'react-router-dom';

import Layout from './components/Layout';
import RedirectComponent from './components/Redirect';

const Router: FC = () => (
  <BrowserRouter>
    <Switch>
      <Route component={Layout} path='/' exact />
      <Route
        component={() => <RedirectComponent url='https://arcanebot.xyz/leaderboard/pepeemoji' />}
        path='/leaderboard'
      />
      <Route
        component={() => <RedirectComponent url='https://teespring.com/stores/pepe-emoji-server' />}
        path='/merch'
      />
      <Route
        component={() => <RedirectComponent url='https://discord.gg/pepe' />}
        path='/invite'
      />
      <Route
        component={() => (
          <RedirectComponent
            url='https://discord.com/api/oauth2/authorize?client_id=506186003816513538&permissions=1916136703&scope=bot'
          />
        )}
        path='/bot-invite'
      />
      <Redirect to='/' />
    </Switch>
  </BrowserRouter>
);

export default Router;
