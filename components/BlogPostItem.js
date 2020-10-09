import React from 'react';
import Link from 'next/link'
import { Card, Text } from '@geist-ui/react';

const BlogPostItem = ({ date, slug, title, category }) => (
  <Card shadow>
    <Text h3><Link href={slug}>{title}</Link></Text>
    <Card.Footer>
      {category !== null && (
      <Text small type="secondary">Category: <Link href={'/' + category.replace(/\s/g, '').toLowerCase() + '/'}>{category}</Link></Text>
      )}
      <Text small type="secondary">Posted on {(new Date(date)).toDateString()}</Text>
    </Card.Footer>
  </Card>
);

export default BlogPostItem;
