import React, { FC } from 'react';
import Head from 'next/head';
import { Grid, Text } from '@geist-ui/react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { fetchBlogPosts, BlogPostItem } from '../lib/contentful';
import BlogPostGrid from '../components/BlogPostGrid';

const POST_LIMIT = 6;

interface Props {
  posts: BlogPostItem[];
}

const Homepage: FC<Props> = ({ posts }) => {
  if (!posts) {
    return <p>Loading</p>;
  }

  return (
    <>
      <Head>
        <title>Ash Smith - Senior Software Engineer. Bath, UK</title>
        <meta name="description" content="Senior Software Engineer @ Play Sports Network. Bath, UK" />
      </Head>

      <Grid.Container style={{ margin: 'calc(16pt * 2.5) 0 calc(16pt * 5)' }}>
        <Grid xs={24}>
          <Text h1 style={{ textAlign: 'center', width: '100%' }} size="2.5rem">
            <span role="img" aria-labelledby="waving hand" aria-label="waving hand">👋</span>
            {' '}
            Hey, I’m Ash!
          </Text>
        </Grid>
        <Grid xs={24}>
          <Text h2 style={{ textAlign: 'center', width: '100%' }}>A Software Engineer and keen triathlete.</Text>
        </Grid>
      </Grid.Container>

      <BlogPostGrid>
        <BlogPostGrid.Header>
          <Text h3 style={{ textAlign: 'center' }}>
            Here&apos;s some recent posts of mine...
          </Text>
        </BlogPostGrid.Header>
        <BlogPostGrid.Posts posts={posts} />
        <BlogPostGrid.Footer>
          <Text p em style={{ textAlign: 'center', width: '100%' }}>
            Want to view more?
            {' '}
            <Link href="/posts"><a>See all of my wonderful blog posts</a></Link>
          </Text>
        </BlogPostGrid.Footer>
      </BlogPostGrid>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ preview }) => {
  const posts = await fetchBlogPosts(preview, POST_LIMIT);
  return {
    props: {
      preview: preview ?? false,
      posts: posts ?? [],
    },
  };
};

export default Homepage;
