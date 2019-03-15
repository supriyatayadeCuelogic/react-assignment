import React from 'react';

import PostItem from './PostItem';

const PostList = ({
  posts,
  onEditPost,
  onRemovePost,
}) => (
  <ul>
    {posts.map(post => (
      <PostItem
        key={post.uid}
        posts={post}
        onEditPost={onEditPost}
        onRemovePost={onRemovePost}
      />
    ))}
  </ul>
);

export default PostList;
