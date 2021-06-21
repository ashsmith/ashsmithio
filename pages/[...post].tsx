import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import ErrorPage from 'next/error';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { BlogPostFields, fetchBlogPost, fetchBlogPosts } from '../lib/contentful';
import CodeBlock from '../components/CodeBlock';
import ContentfulImage from '../components/ContentfulImage';
import * as Headings from '../components/Headings';

const Test = ({ children }) => (<div>{children}</div>);

const components = {
  pre: Test,
  code: CodeBlock,
  img: ContentfulImage,
  h1: Headings.H1,
  h2: Headings.H2,
  h3: Headings.H3,
  h4: Headings.H4,
  h5: Headings.H5,
};

interface Props {
  post: BlogPostFields & { content: MDXRemoteSerializeResult };
}

const Post: FC<Props> = ({ post }) => {
  const router = useRouter();
  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />;
  }

  if (router.isFallback && !post?.title) {
    return <p>Loading</p>;
  }

  const postDate = new Date(post.date);

  return (
    <div className="max-w-prose m-auto bg-white -mt-14 px-10 py-8">
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="og:image" content={`https://3nrgyfm9aj.execute-api.eu-west-1.amazonaws.com/dev/hello?name=${encodeURI(post.title)}`} />
        <meta name="og:title" content={post.title} />
        <meta name="twitter:site" content="@ashsmithco" />
        <meta name="twitter:creator" content="@ashsmithco" />
      </Head>
      <section>
        <h1 className="text-4xl text-center mb-2">{post.title}</h1>
        <p className="text-sm text-center mb-8">
          Posted on
          {' '}
          {`${postDate.getDate()}/${postDate.getMonth() + 1}/${postDate.getFullYear()}`}
        </p>
        <article className="main-content">
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <MDXRemote components={components} {...post.content} />
        </article>
      </section>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params: { post }, preview = false }) => {
  const permalink = Array.isArray(post) ? post.join('/') : post;
  const data = await fetchBlogPost(permalink, preview);
  const mdxSource = await serialize(data.fields.content);

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
