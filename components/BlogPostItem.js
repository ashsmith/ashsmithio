import React from 'react';
import Link from 'next/link'
import { Card, Text } from '@geist-ui/react';

const BlogPostItem = ({ date, slug, title, category }) => {
  const categoryPath = category.replace(/\s/g, '-').toLowerCase();
  return (
    <Card shadow style={{display: 'flex', flexDirection: 'column'}}>
      <Card.Content style={{ flex: '1 0 auto' }}>
        <Text h3><Link href={slug}>{title}</Link></Text>
      </Card.Content>
      <Card.Footer>
        {category !== null && (
          <Text small type="secondary">Category: <Link href={`/category/${categoryPath}`}><a>{category}</a></Link></Text>
        )}
        <Text small type="secondary">Posted on {(new Date(date)).toDateString()}</Text>
      </Card.Footer>
    </Card>
  );
}

export default BlogPostItem;
