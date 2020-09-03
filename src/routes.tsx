import React, { FC } from 'react';
import {
  BrowserRouter, Redirect, Route, Switch,
} from 'react-router-dom';

import Layout from './components/Layout';

const Router: FC = () => (
  <BrowserRouter>
    <Switch>
      <Route component={Layout} path='/' exact />
      <Redirect to='/' />
    </Switch>
  </BrowserRouter>
);

export default Router;
