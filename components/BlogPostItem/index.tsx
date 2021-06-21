import React, { FC } from 'react';
import Link from 'next/link';
import CategoryLink from './CategoryLink';

interface Props {
  date: string;
  permalink: string;
  title: string;
  category?: string;
}

const BlogPostItem: FC<Props> = ({
  date, permalink, title, category,
}) => {
  const postDate = new Date(date);
  return (
    <div>
      <div style={{ flex: '1 0 auto' }}>
        <h3>
          <Link href={`/${permalink}`}><a>{title}</a></Link>
        </h3>
      </div>
      <div>
        {category !== null && (<CategoryLink category={category} />)}
        <span>
          Posted on
          {' '}
          {`${postDate.getDate()}/${postDate.getMonth() + 1}/${postDate.getFullYear()}`}
        </span>
      </div>
    </div>
  );
};

export default BlogPostItem;
