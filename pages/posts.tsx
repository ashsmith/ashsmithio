import React, { FC } from 'react';
import { Text } from '@geist-ui/react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { BlogPostItem, fetchBlogPosts } from '../lib/contentful';
import BlogPostGrid from '../components/BlogPostGrid';

interface Props {
  posts: BlogPostItem[];
}

const Posts: FC<Props> = ({ posts }) => (
  <>
    <Head>
      <title>Ash Smith - All of my blog posts...</title>
      <meta name="description" content="All of my posts... enjoy ;)" />
    </Head>
    <BlogPostGrid>
      <BlogPostGrid.Header>
        <Text h1 style={{ textAlign: 'center' }}>All of my wonderful blog posts...</Text>
      </BlogPostGrid.Header>
      <BlogPostGrid.Posts posts={posts} />
    </BlogPostGrid>
  </>
);

export const getStaticProps: GetStaticProps = async ({ preview }) => {
  const posts = await fetchBlogPosts(preview);
  return {
    props: {
      preview: preview ?? false,
      posts: posts ?? [],
    },
  };
};

export default Posts;
