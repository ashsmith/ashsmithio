import React, { FC } from 'react';
import Link from 'next/link';
import { Card, Text } from '@geist-ui/react';
import CategoryLink from './CategoryLink';

interface Props {
  date: string;
  permalink: string;
  title: string;
  category?: string;
}

const BlogPostItem: FC<Props> = ({
  date, permalink, title, category,
}) => (
  <Card shadow style={{ display: 'flex', flexDirection: 'column' }}>
    <Card.Content style={{ flex: '1 0 auto' }}>
      <Text h3>
        <Link href={permalink}><a>{title}</a></Link>
      </Text>
    </Card.Content>
    <Card.Footer>
      {category !== null && (<CategoryLink category={category} />)}
      <Text small type="secondary">
        Posted on
        {' '}
        {(new Date(date)).toLocaleDateString()}
      </Text>
    </Card.Footer>
  </Card>
);

export default BlogPostItem;
