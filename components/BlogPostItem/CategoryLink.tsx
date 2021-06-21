import React, { FC } from 'react';
import Link from 'next/link';

interface Props {
  category: string;
}
const CategoryLink: FC<Props> = ({ category }) => {
  const categories = category.split(',').map((cat) => cat.trim());
  return (
    <span>
      Category:
      {' '}
      {categories.map((cat) => {
        const catPath = cat.replace(/\s/g, '-').toLowerCase();
        return (<Link key={catPath} href={`/category/${catPath}`}><a>{cat}</a></Link>);
      })}
    </span>
  );
};

export default CategoryLink;
