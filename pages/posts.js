import React from 'react';
import { Text } from '@geist-ui/react';
import { fetchBlogPosts } from '../lib/contentful';
import BlogPostGrid from '../components/BlogPostGrid';

const Posts = ({ posts }) => (
  <BlogPostGrid
    posts={posts}
    heading={(<Text h1 style={{ textAlign: 'center' }}>All of my wonderful blog posts...</Text>)}
  />
);

export async function getStaticProps({ preview }) {
  const posts = await fetchBlogPosts(preview);
  return {
    props: {
      preview: preview ?? false,
      posts: posts ?? []
    }
  }
}

export default Posts;