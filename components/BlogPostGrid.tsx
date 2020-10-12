import React, { Component, FC } from 'react';
import { Grid } from '@geist-ui/react';
import BlogPostItem from './BlogPostItem';
import { BlogPostItem as BlogPostItemType } from '../lib/contentful';

interface PostProps {
  posts: BlogPostItemType[];
}

class BlogPostGrid extends Component {
  static Header: FC = ({ children }) => (<Grid xs={24}>{children}</Grid>);

  static Footer: FC = ({ children }) => (<Grid xs={24}>{children}</Grid>);

  static Posts: FC<PostProps> = ({ posts }) => (
    <>
      {posts.map(({ fields }) => (
        <Grid key={fields.permalink} xs={24} md={12} dir="column" style={{ display: 'flex' }}>
          <BlogPostItem
            permalink={fields.permalink}
            title={fields.title}
            date={fields.date}
            category={fields.category}
          />
        </Grid>
      ))}
    </>
  );

  render() {
    const { children } = this.props;
    return (
      <Grid.Container gap={4}>
        {children}
      </Grid.Container>
    );
  }
}

export default BlogPostGrid;
