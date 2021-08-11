import React, { FC } from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { BlogPostItem, fetchBlogPostsByCategory } from '../../lib/contentful';
import BlogPostGrid from '../../components/BlogPostGrid';

/**
 * Capitalize first letter of each word in a given string.
 */
const capitalize = (str: string) => {
  const parts = str.split(' ').map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  return parts.join(' ');
};

interface Props {
  posts: BlogPostItem[];
  category: string;
}

const Category: FC<Props> = ({ posts, category }) => {
  if (!posts || posts.length === 0) {
    return <p>Loading</p>;
  }

  return (
    <>
      <Head>
        <title>
          Ash Smith - Category:
          {capitalize(category)}
        </title>
        <meta name="description" content={`Some ${capitalize(category)} posts... enjoy ;)`} />
      </Head>
      <BlogPostGrid>
        <BlogPostGrid.Header>
          <h1 style={{ textAlign: 'center' }}>
            {category}
            {' '}
            Posts
          </h1>
        </BlogPostGrid.Header>
        <BlogPostGrid.Posts posts={posts} />
      </BlogPostGrid>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ preview, params: { name } }) => {
  const categoryName = Array.isArray(name) ? name.join('') : name;
  const category = capitalize(categoryName.replace('-', ' '));
  const posts = await fetchBlogPostsByCategory(preview, category);
  return {
    props: {
      preview: preview ?? false,
      posts: posts ?? [],
      category,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: true,
});

export default Category;
