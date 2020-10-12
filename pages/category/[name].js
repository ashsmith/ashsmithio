import Head from 'next/head';
import { Text } from '@geist-ui/react';
import { fetchBlogPostsByCategory } from '../../lib/contentful';
import BlogPostGrid from '../../components/BlogPostGrid';

/**
 * Capitalize first letter of each word in a given string.
 */
String.prototype.capitalize = function() {
  const parts = this.split(' ').map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  return parts.join(' ');
}

const Category = ({ posts, category }) => {
  if (!posts || posts.length === 0) {
    return <p>Loading</p>
  }

  return (
    <>
      <Head>
        <title>Ash Smith - Category: {category.capitalize()}</title>
        <meta name="description" content={`Some ${category.capitalize()} posts... enjoy ;)`} />
      </Head>
      <BlogPostGrid>
        <BlogPostGrid.Header>
          <Text h1 style={{ textAlign: 'center' }}>{category} Posts</Text>
        </BlogPostGrid.Header>
        <BlogPostGrid.Posts posts={posts} />
      </BlogPostGrid>
    </>
  );
}

export async function getStaticProps({ preview, params }) {
  const category = params.name.replace('-', ' ').capitalize();
  const posts = await fetchBlogPostsByCategory(preview, category);
  return {
    props: {
      preview: preview ?? false,
      posts: posts ?? [],
      category,
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export default Category
