import React from 'react';
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom';

import Navigation from '../Navigation';

import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';

import HomePage from '../Home';
import AddPost from './../Posts/AddPost';
import DoughnutChrt from './../Dashboard';
import User from './../User';


import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import NoMatch from './../NoMatch';

const App = () => (
  <Router>
    <div>
      <Navigation />

      <hr />

      <Switch>
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.LANDING} component={HomePage} />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.NEW_POST} component={AddPost} />
      <Route path={ROUTES.DASHBOARD} component={DoughnutChrt} />
      <Route path={ROUTES.USER_LIST} component={User} />
      <Route component={NoMatch} />
      </Switch>
    </div>
  </Router>
);

export default withAuthentication(App);
