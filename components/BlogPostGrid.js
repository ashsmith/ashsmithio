import React, { Component } from 'react';
import { Grid } from '@geist-ui/react';
import BlogPostItem from './BlogPostItem';

class BlogPostGrid extends Component {
  static Header = ({ children }) => (<Grid xs={24}>{children}</Grid>);
  static Footer = ({ children }) => (<Grid xs={24}>{children}</Grid>);
  static Posts = ({ posts }) => posts.map(({ fields }) => (
    <Grid key={fields.permalink} xs={24} md={12} dir="column" style={{display: 'flex'}}>
      <BlogPostItem
        slug={fields.permalink}
        title={fields.title}
        date={fields.date}
        category={fields.category}
      />
    </Grid>
  ));

  render() {
    return (
      <Grid.Container gap={4}>
        {this.props.children}
      </Grid.Container>
    )
  }
}

export default BlogPostGrid;
