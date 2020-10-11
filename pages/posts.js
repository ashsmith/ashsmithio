import React from 'react';
import { Grid, Text } from '@geist-ui/react';
import BlogPostItem from '../components/BlogPostItem';
import { fetchBlogPosts } from '../lib/contentful';

const Posts = ({ posts }) => (
  <Grid.Container gap={4}>
    <Grid xs={24}>
      <Text h1>All of my wonderful blog posts...</Text>
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