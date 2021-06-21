import React, { FC } from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { BlogPostItem, fetchBlogPostsByCategory } from '../../lib/contentful';
import BlogPostGrid from '../../components/BlogPostGrid';

/**
 * Capitalize first letter of each word in a given string.
 */
/* eslint-disable-next-line no-extend-native,func-names */
String.prototype.capitalize = function () {
  const parts = this.split(' ').map((part) => part.charAt(0).toUpperCase() + part.slice(1));
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
          {category.capitalize()}
        </title>
        <meta name="description" content={`Some ${category.capitalize()} posts... enjoy ;)`} />
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
  const category = categoryName.replace('-', ' ').capitalize();
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
