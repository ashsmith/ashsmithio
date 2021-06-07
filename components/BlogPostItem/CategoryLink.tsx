import React, { FC } from 'react';
import Link from 'next/link';
import { Text } from '@geist-ui/react';

interface Props {
  category: string;
}
const CategoryLink: FC<Props> = ({ category }) => {
  const categories = category.split(',').map((cat) => cat.trim());
  return (
    <Text small type="secondary">
      Category:
      {' '}
      {categories.map((cat) => {
        const catPath = cat.replace(/\s/g, '-').toLowerCase();
        return (<Link key={catPath} href={`/category/${catPath}`}><a>{cat}</a></Link>);
      })}
    </Text>
  );
};

export default CategoryLink;
