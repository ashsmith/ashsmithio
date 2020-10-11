import Head from 'next/head';
import { Grid, Text } from '@geist-ui/react';
import BlogPostItem from '../../components/BlogPostItem';
import { fetchBlogPostsByCategory } from '../../lib/contentful';

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

      <Grid.Container gap={4}>
        <Grid xs={24}>
          <Text h3 style={{ textAlign: 'center' }}>{category} Posts</Text>
        </Grid>
        {posts.map(({ fields }) => {
          return (
            <Grid key={fields.permalink} xs={24} md={12}>
              <BlogPostItem
                slug={fields.permalink}
                title={fields?.title || fields.permalink}
                date={fields.date}
                category={fields.category}
              />
            </Grid>)
        })}
      </Grid.Container>
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
