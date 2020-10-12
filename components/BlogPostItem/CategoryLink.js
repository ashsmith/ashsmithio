import React from 'react';
import Link from 'next/link'
import { Text } from '@geist-ui/react';

const CategoryLink = ({ category }) => {
  const categoryPath = category.replace(/\s/g, '-').toLowerCase();
  return (
    <Text small type="secondary">
      Category: <Link href={`/category/${categoryPath}`}><a>{category}</a></Link>
    </Text>
  );
}

export default CategoryLink;