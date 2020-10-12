import React from 'react';
import Link from 'next/link'
import { Card, Text } from '@geist-ui/react';
import CategoryLink from './CategoryLink';

const BlogPostItem = ({ date, slug, title, category }) => (
  <Card shadow style={{display: 'flex', flexDirection: 'column'}}>
    <Card.Content style={{ flex: '1 0 auto' }}>
      <Text h3>
        <Link href={slug}><a>{title}</a></Link>
      </Text>
    </Card.Content>
    <Card.Footer>
      {category !== null && (<CategoryLink category={category} />)}
      <Text small type="secondary">Posted on {(new Date(date)).toLocaleDateString()}</Text>
    </Card.Footer>
  </Card>
);

export default BlogPostItem;
