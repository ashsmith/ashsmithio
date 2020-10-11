import React from 'react';
import { Grid, Text } from '@geist-ui/react';
import BlogPostItem from './BlogPostItem';

const BlogPostGrid = ({ heading, footer, posts }) => {

  return (
    <Grid.Container gap={4}>
      {typeof heading !== 'undefined' && (
        <Grid xs={24}>
          {heading}
        </Grid>
      )}
      {posts.map(({ fields }) => {
        return (
          <Grid key={fields.permalink} xs={24} md={12} dir="column" style={{display: 'flex'}}>
            <BlogPostItem
              slug={fields.permalink}
              title={fields?.title || fields.permalink}
              date={fields.date}
              category={fields.category}
            />
          </Grid>)
      })}

      {typeof footer !== 'undefined' && (
        <Grid xs={24}>
          {footer}
        </Grid>
      )}
    </Grid.Container>
  );
};

export default BlogPostGrid;
