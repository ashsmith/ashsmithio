import Head from 'next/head';
import { Grid, Text } from '@geist-ui/react';
import BlogPostItem from '../../components/BlogPostItem';
import { fetchBlogPostsByCategory } from '../../lib/contentful';
import BlogPostGrid from '../../components/BlogPostGrid';

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
        <title>Ash Smith - Senior Software Engineer. Bath, UK</title>
        <meta name="description" content="Senior Software Engineer @ Play Sports Network. Bath, UK" />
      </Head>

      <BlogPostGrid
        posts={posts}
        heading={(<Text h1 style={{ textAlign: 'center' }}>{category} Posts</Text>)}
      />
    </>
  )
}

export async function getStaticProps({ preview, params}) {
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
