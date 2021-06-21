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
    <div className="border border-gray-100 shadow-md p-5 flex flex-col">
      <div className="mb-2" style={{ flex: '1 0 auto' }}>
        <h3 className="text-xl">
          <Link href={`/${permalink}`}><a className="text-blue-500 hover:underline">{title}</a></Link>
        </h3>
      </div>
      <div className="border-t text-sm text-gray-500">
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
