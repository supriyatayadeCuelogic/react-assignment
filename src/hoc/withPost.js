import React from 'react';

const withPost = WrappedComponent => {
  return props => (
    <div>
      <WrappedComponent {...props}/>
    </div>
  );
};

export default withPost;
