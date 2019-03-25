const INITIAL_STATE = {
    posts: [],
  limit: 5,
};

const applySetMessages = (state, action) => ({
  ...state,
  posts: action.post,
});

const applySetMessagesLimit = (state, action) => ({
  ...state,
  limit: action.limit,
});

function postReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'POSTS_SET': {
      return applySetMessages(state, action);
    }
    case 'POSTS_LIMIT_SET': {
      return applySetMessagesLimit(state, action);
    }
    default:
      return state;
  }
}

export default postReducer;
