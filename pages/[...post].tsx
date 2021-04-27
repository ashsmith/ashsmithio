import React, { FC } from 'react';
import { useRouter } from 'next/router';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';

import ErrorPage from 'next/error';
import Head from 'next/head';
import { Text } from '@geist-ui/react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { BlogPostFields, fetchBlogPost, fetchBlogPosts } from '../lib/contentful';
import CodeBlock from '../components/CodeBlock';
import ContentfulImage from '../components/ContentfulImage';
import * as Headings from '../components/Headings';

const components = {
  code: CodeBlock,
  img: ContentfulImage,
  h1: Headings.H1,
  h2: Headings.H2,
  h3: Headings.H3,
  h4: Headings.H4,
  h5: Headings.H5,
};

interface Props {
  post: BlogPostFields;
}

const Post: FC<Props> = ({ post }) => {
  const router = useRouter();
  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />;
  }

  if (router.isFallback && !post?.title) {
    return <p>Loading</p>;
  }
  const content = hydrate(post.content, { components });

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="og:image" content={`https://3nrgyfm9aj.execute-api.eu-west-1.amazonaws.com/dev/hello?name=${encodeURI(post.title)}`} />
        <meta name="og:title" content={post.title} />
        <meta name="twitter:site" content="@ashsmithco" />
        <meta name="twitter:creator" content="@ashsmithco" />
      </Head>
      <>
        <Text h1 size="2.5rem" style={{ textAlign: 'center' }}>{post.title}</Text>
        <Text type="secondary">
          Posted on
          {' '}
          {(new Date(post.date).toLocaleDateString())}
        </Text>
        {content}
      </>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params: { post }, preview = false }) => {
  const permalink = Array.isArray(post) ? post.join('/') : post;
  const data = await fetchBlogPost(permalink, preview);

  const mdxSource = await renderToString(data.fields.content, { components });

  return {
    props: {
      preview,
      post: {
        ...data?.fields,
        content: mdxSource,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await fetchBlogPosts(false);
  return {
    paths: allPosts?.map(({ fields: { permalink } }) => `/${permalink}`) ?? [],
    fallback: true,
  };
};

export default Post;
