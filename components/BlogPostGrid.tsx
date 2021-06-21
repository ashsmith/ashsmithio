import React, { Component, FC } from 'react';
import BlogPostItem from './BlogPostItem';
import { BlogPostItem as BlogPostItemType } from '../lib/contentful';

interface PostProps {
  posts: BlogPostItemType[];
}

class BlogPostGrid extends Component {
  static Header: FC = ({ children }) => (<div>{children}</div>);

  static Footer: FC = ({ children }) => (<div>{children}</div>);

  static Posts: FC<PostProps> = ({ posts }) => (
    <>
      {posts.map(({ fields }) => (
        <div key={fields.permalink}>
          <BlogPostItem
            permalink={fields.permalink}
            title={fields.title}
            date={fields.date}
            category={fields.category}
          />
        </div>
      ))}
    </>
  );

  render() {
    const { children } = this.props;
    return (
      <div>
        {children}
      </div>
    );
  }
}

export default BlogPostGrid;
