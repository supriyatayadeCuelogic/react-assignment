import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavigationAuth authUser={authUser} />
      ) : (
          <NavigationNonAuth />
        )
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
  <div>
    <ul className="flex-column">
      <li>
        <Link to={ROUTES.HOME}>Manage Posts</Link>
      </li>
      <li>
        <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
      </li>
      <li>
        <Link to={ROUTES.USER_LIST}>Users</Link>
      </li>
      <li>
        <SignOutButton />
      </li>
    </ul>    
  </div>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

export default Navigation;
