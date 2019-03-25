import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import messageReducer from './message';
import postReducer from './post';

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  messageState: messageReducer,
  postState: postReducer
});

export default rootReducer;
