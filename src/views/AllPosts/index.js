import React from 'react';
import PostList from '../../components/Posts/PostList';

export default function AllPosts({ posts, users }) {
  return <PostList posts={posts} />;
}
