import React, { FC } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { BlogPostItem, fetchBlogPosts } from '../lib/contentful';
import BlogPostGrid from '../components/BlogPostGrid';

interface Props {
  posts: BlogPostItem[];
}

const Posts: FC<Props> = ({ posts }) => (
  <div className="max-w-4xl m-auto bg-white -mt-14 px-10 py-8">
    <Head>
      <title>Ash Smith - All of my blog posts...</title>
      <meta name="description" content="All of my posts... enjoy ;)" />
    </Head>
    <BlogPostGrid>
      <BlogPostGrid.Header>
        <h1 className="text-center w-full text-lg font-bold">All of my wonderful blog posts...</h1>
      </BlogPostGrid.Header>
      <BlogPostGrid.Posts posts={posts} />
    </BlogPostGrid>
  </div>
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
