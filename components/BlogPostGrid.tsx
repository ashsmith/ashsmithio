import React, { Component, FC } from 'react';
import BlogPostItem from './BlogPostItem';
import type { BlogPostItem as BlogPostItemType } from '../lib/contentful_types';

interface PostProps {
  posts: BlogPostItemType[];
}

class BlogPostGrid extends Component {
  static Header: FC = ({ children }) => (<div className="mb-6">{children}</div>);

  static Footer: FC = ({ children }) => (<div className="mt-6">{children}</div>);

  static Posts: FC<PostProps> = ({ posts }) => (
    <div className="grid grid-cols-2 gap-4">
      {posts.map(({ fields }) => (
        <BlogPostItem
          key={fields.permalink}
          permalink={fields.permalink}
          title={fields.title}
          date={fields.date}
          category={fields.category}
        />
      ))}
    </div>
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
