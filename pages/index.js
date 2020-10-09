import Head from 'next/head';
import { Grid, Text } from '@geist-ui/react';
import BlogPostItem from '../components/BlogPostItem';
import { fetchBlogPosts } from '../lib/contentful';


const Homepage = ({ posts }) => {
  if (!posts) {
    return <p>Loading</p>
  }

  return (
    <>
      <Head>
        <title>Ash Smith - Senior Software Engineer. Bath, UK</title>
        <meta name="description" content="Senior Software Engineer @ Play Sports Network. Bath, UK" />
      </Head>

      <Grid.Container style={{ margin: '8rem 0' }} justify="center">
        <Grid xs={20} alignContent="center" alignItems="center">
          <Text h1 size="3em" style={{ textAlign: 'center' }}>👋 Hey, I’m Ash! A Software Engineer and keen triathlete.</Text>
        </Grid>
      </Grid.Container>

      <Text h3 style={{ textAlign: 'center' }}>Here's a few posts of mine...</Text>
      <Grid.Container gap={4}>
        {posts.map(({ fields }) => {
          return (
            <Grid key={fields.permalink} xs={24} md={12}>
              <BlogPostItem
                slug={fields.permalink}
                title={fields?.title || fields.permalink}
                date={fields.date} category={fields.category}
              />
            </Grid>)
        })}
      </Grid.Container>
    </>
  )
}

export async function getStaticProps({ preview }) {
  const posts = await fetchBlogPosts(preview);
  return {
    props: {
      preview: preview ?? false,
      posts: posts ?? []
    }
  }
}

export default Homepage
