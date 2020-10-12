import React, { FC } from 'react';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Text } from '@geist-ui/react';
import ReactMarkdown from 'react-markdown';
import { GetStaticPaths, GetStaticProps } from 'next';
import { BlogPostFields, fetchBlogPost, fetchBlogPosts } from '../lib/contentful';

// Dynamic importing of components so they're only rendered when used!
const CodeBlock = dynamic(() => import('../components/CodeBlock'));
const ContentfulImage = dynamic(() => import('../components/ContentfulImage'));
const Heading = ({ level, children }) => (<Text {...{ [`h${level}`]: true }}>{children}</Text>);

interface Props {
  post: BlogPostFields;
}

const Post: FC<Props> = ({ post }) => {
  const router = useRouter();
  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />;
  }

  if (!post?.title) {
    return <p>Loading</p>;
  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.title} />
      </Head>
      <>
        <Text h1 size="2.5rem" style={{ textAlign: 'center' }}>{post.title}</Text>
        <Text type="secondary">
          Posted on
          {' '}
          {(new Date(post.date).toLocaleDateString())}
        </Text>
        <ReactMarkdown
          source={post.content}
          renderers={{
            code: CodeBlock,
            image: ContentfulImage,
            heading: Heading,
          }}
        />
      </>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params: { post }, preview = false }) => {
  const permalink = Array.isArray(post) ? post.join('/') : post;
  const data = await fetchBlogPost(permalink, preview);
  return {
    props: {
      preview,
      post: {
        ...data?.fields,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await fetchBlogPosts(true);
  return {
    paths: allPosts?.map(({ fields: { permalink } }) => `/${permalink}`) ?? [],
    fallback: true,
  };
};

export default Post;
