import React from 'react';
import { Text } from '@geist-ui/react';
import { fetchBlogPosts } from '../lib/contentful';
import BlogPostGrid from '../components/BlogPostGrid';
import Head from 'next/head';

const Posts = ({ posts }) => (
  <>
    <Head>
      <title>Ash Smith - All of my blog posts...</title>
      <meta name="description" content={`All of my posts... enjoy ;)`} />
    </Head>
    <BlogPostGrid>
      <BlogPostGrid.Header>
        <Text h1 style={{ textAlign: 'center' }}>All of my wonderful blog posts...</Text>
      </BlogPostGrid.Header>
      <BlogPostGrid.Posts posts={posts} />
    </BlogPostGrid>
  </>
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