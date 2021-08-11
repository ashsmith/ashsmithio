import React, { FC } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { fetchBlogPosts, BlogPostItem } from '../lib/contentful';
import BlogPostGrid from '../components/BlogPostGrid';

const POST_LIMIT = 6;

interface Props {
  posts: BlogPostItem[];
}

const Homepage: FC<Props> = ({ posts = [] }) => (
  <>
    <Head>
      <title>Ash Smith - Senior Software Engineer. Bath, UK</title>
      <meta name="description" content="Senior Software Engineer @ Play Sports Network. Bath, UK" />
    </Head>

    <div className="max-w-4xl m-auto bg-white -mt-14 px-10 py-8">
      <h1 className="text-center w-full text-3xl font-extrabold">
        <span role="img" aria-labelledby="waving hand" aria-label="waving hand">👋</span>
        {' '}
        Hey, I’m Ash!
      </h1>
      <h2 className="text-center w-full text-xl font-bold">Software Engineer and keen triathlete.</h2>
      <p className="max-w-prose m-auto mt-4 text-center">Welcome! I&apos;m a passionate software engineer specialising in cloud and serverless technologies such as AWS and GCP. My blog is mismash of things I have found useful over the years, hopefully you&apos;ll find them useful too! When I&apos;m not working I can usually be found swimming, cycling or running.</p>

    </div>
    <div className="max-w-4xl m-auto bg-white mt-6 px-10 py-8">
      <BlogPostGrid>
        <BlogPostGrid.Header>
          <h3 className="text-center w-full text-lg font-bold">
            Here&apos;s some recent posts of mine...
          </h3>
        </BlogPostGrid.Header>
        <BlogPostGrid.Posts posts={posts} />
        <BlogPostGrid.Footer>
          <p className="text-center w-full">
            Want to view more?
            {' '}
            <Link href="/posts"><a className="text-blue-500 hover:underline">See all of my wonderful blog posts</a></Link>
          </p>
        </BlogPostGrid.Footer>
      </BlogPostGrid>
    </div>
  </>
);

export const getStaticProps: GetStaticProps = async ({ preview }) => {
  const posts = await fetchBlogPosts(preview, POST_LIMIT);
  return {
    props: {
      preview: preview ?? false,
      posts: posts ?? [],
    },
  };
};

export default Homepage;
